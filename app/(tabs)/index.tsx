import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { ProductoCard } from '@/components/product/ProductoCard';
import { useProductFilter } from '@/hooks/useProductFilter';
import { CATEGORIAS } from '@/mocks/categories';
import { useGetProductsQuery } from '@/store/productsApi'; // ← CAMBIÓ
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { data: products = [], isLoading: loading } = useGetProductsQuery(); // ← CAMBIÓ
  const { filteredProducts, selectedCategory, setSelectedCategory } =
    useProductFilter(products);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10, color: '#666' }}>Cargando productos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.brand}>ZERELLE</Text>
        <Text style={styles.subtitle}>Nueva Colección</Text>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 15 }}
        ListHeaderComponent={
          <CategoryCarousel
            categorias={CATEGORIAS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: '48%', marginBottom: 15 }}
            onPress={() => router.push({
              pathname: "/details/[id]",
              params: { id: item.id },
            })}
          >
            <ProductoCard {...item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  headerContainer: { padding: 30, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
  brand: { fontSize: 32, fontWeight: '900', letterSpacing: 4, color: '#000' },
  subtitle: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginTop: 5 },
});