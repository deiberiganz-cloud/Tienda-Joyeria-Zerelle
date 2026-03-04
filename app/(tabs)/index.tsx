import { ProductoCard } from '@/components/ProductoCard';
import { CATEGORIAS } from '@/mocks/categories';
import { PRODUCTS } from '@/mocks/products';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const RenderMarcas = () => (
    <View style={{ marginVertical: 20 }}>
      <FlatList
        data={CATEGORIAS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ alignItems: 'center', marginHorizontal: 12 }}>
            <TouchableOpacity style={styles.brandBubble}>
              <Text style={styles.brandIcon}>{item.icono}</Text>
            </TouchableOpacity>
            <Text style={styles.brandText}>{item.nombre}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.brand}>ZERELLE</Text>
        <Text style={styles.subtitle}>Nueva Colección</Text>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 15 }}
        ListHeaderComponent={<RenderMarcas />} 
        
        renderItem={({ item }) => (
          <ProductoCard {...item} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8' 
  },
  headerContainer: {
    padding: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  brand: { 
    fontSize: 32, 
    fontWeight: '900', 
    letterSpacing: 4,
    color: '#000' 
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  brandBubble: {
    width: 65,
    height: 65,
    borderRadius: 32.5, // La mitad del tamaño para que sea un círculo perfecto
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  brandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  brandText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});