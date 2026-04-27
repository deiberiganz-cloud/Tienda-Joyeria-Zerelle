import AddToCartModal from '@/components/product/AddToCartModal';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RecommendedProducts from '@/components/product/RecommendedProducts';
import { db } from '@/database/firebaseConfig';
import type { Product } from '@/domain/types';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const cart = useAddToCart();
  const [producto, setProducto] = useState<Product | null>(null);
  const [productosRecomendados, setProductosRecomendados] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar producto desde Firestore
  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError('ID de producto inválido');
      setLoading(false);
      return;
    }

    const loadProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        const productoRef = doc(db, 'products', id);
        const productoSnap = await getDoc(productoRef);

        if (productoSnap.exists()) {
          const data = productoSnap.data() as Product;
          setProducto(data);
        } else {
          setError('Producto no encontrado');
          setProducto(null);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setError('Error al cargar el producto');
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    loadProducto();
  }, [id]);

  // Cargar productos recomendados por categoría
  useEffect(() => {
    if (!producto?.categoria) return;

    const loadProductosRecomendados = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('categoria', '==', producto.categoria)
        );
        const querySnapshot = await getDocs(q);
        const productos = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Product))
          .filter((p) => p.id !== producto.id);

        setProductosRecomendados(productos);
      } catch (err) {
        console.error('Error al cargar productos recomendados:', err);
        setProductosRecomendados([]);
      }
    };

    loadProductosRecomendados();
  }, [producto?.categoria, producto?.id]);

  // Mostrar loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar error
  if (error || !producto) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
          <TouchableOpacity style={styles.backButtonText} onPress={() => router.back()}>
            <Text style={styles.backButtonTextContent}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = producto.imagenes || [producto.imagen || ''];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <ProductGallery images={images} activeIndex={activeIndex} onSelectImage={setActiveIndex} />
          <ProductInfo {...producto} id={producto.id} imagen={images[0]} onAddToCart={cart.openModal} />
          <RecommendedProducts products={productosRecomendados} currentProductId={producto.id} />
        </ScrollView>
        <AddToCartModal visible={cart.modalVisible} cantidad={cart.cantidad} onClose={cart.closeModal}
          onDecrease={cart.decreaseQuantity} onIncrease={cart.increaseQuantity}
          onConfirm={() => cart.confirmAddToCart({ id: producto.id, nombre: producto.nombre,
            precio: producto.precio, imagen: images[0] })} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 4 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#d9534f', textAlign: 'center', marginBottom: 20 },
  backButtonText: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  backButtonTextContent: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
