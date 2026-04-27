import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';
import { Product } from '@/domain/types';
import { useProductAdmin } from '@/hooks/useProductAdmin';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type AdminTab = 'list' | 'create' | 'edit';

export default function AdminScreen() {
  const router = useRouter();
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
  } = useProductAdmin();

  const [currentTab, setCurrentTab] = useState<AdminTab>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | undefined>();

  const handleCreateProduct = async (data: any) => {
    try {
      await createProduct(data);
      Alert.alert('✅ Éxito', 'Producto creado correctamente');
      setCurrentTab('list');
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'Error al crear el producto');
    }
  };

  const handleEditProduct = async (data: any) => {
    if (!selectedProduct) return;
    try {
      await updateProduct(selectedProduct.id, data);
      Alert.alert('✅ Éxito', 'Producto actualizado correctamente');
      setCurrentTab('list');
      setSelectedProduct(undefined);
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      Alert.alert('✅ Éxito', 'Producto eliminado correctamente');
      setDeleteConfirmVisible(false);
      setProductToDelete(undefined);
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'Error al eliminar el producto');
    }
  };

  const handleEditProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('edit');
  };

  const handleCancelForm = () => {
    setSelectedProduct(undefined);
    setCurrentTab('list');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Panel Admin</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'list' && styles.tabActive]}
          onPress={() => setCurrentTab('list')}
        >
          <Text style={[styles.tabText, currentTab === 'list' && styles.tabTextActive]}>
            📦 Productos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'create' && styles.tabActive]}
          onPress={() => {
            setSelectedProduct(undefined);
            setCurrentTab('create');
          }}
        >
          <Text style={[styles.tabText, currentTab === 'create' && styles.tabTextActive]}>
            ➕ Crear
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {currentTab === 'list' && (
          <ProductList
            products={products}
            loading={loading}
            onEdit={handleEditProductClick}
            onDelete={handleDeleteProduct}
            onRefresh={getProducts}
          />
        )}

        {currentTab === 'create' && (
          <ProductForm
            loading={loading}
            onSubmit={handleCreateProduct}
            onCancel={handleCancelForm}
          />
        )}

        {currentTab === 'edit' && selectedProduct && (
          <ProductForm
            initialProduct={selectedProduct}
            loading={loading}
            onSubmit={handleEditProduct}
            onCancel={handleCancelForm}
          />
        )}
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        visible={deleteConfirmVisible}
        productName={productToDelete?.nombre || ''}
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setProductToDelete(undefined);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 4,
  },
  backButton: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#000',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    borderBottomWidth: 1,
    borderBottomColor: '#ffcdd2',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#d32f2f',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});