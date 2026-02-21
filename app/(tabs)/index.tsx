import { StyleSheet, FlatList, View, Text,TouchableOpacity  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductoCard } from '@/components/ProductoCard';
// Estos son los datos de tu tienda Zerelle
const CATEGORIAS = [
  { id: '1', nombre: 'All', icono: '✨' },
  { id: '2', nombre: 'Pulseras', icono: '📿' },
  { id: '3', nombre: 'Sets', icono: '🎁' },
  { id: '4', nombre: 'Aros', icono: '💍' },
  { id: '5', nombre: 'Collares', icono: '📿' },
  { id: '6', nombre: 'Bicolor', icono: '🌓' }, // Para Acero Bicolor
];
const PRODUCTOS = [
  { 
    id: '1', 
    nombre: 'Anillo de Oro 18k', 
    marca: 'ZERELLE', 
    precio: '$850', 
    imagen: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '2', 
    nombre: 'Collar de Perlas', 
    marca: 'ZERELLE', 
    precio: '$1,200', 
    imagen: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '3', 
    nombre: 'Brazalete Minimal', 
    marca: 'ZERELLE', 
    precio: '$650', 
    imagen: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '4', 
    nombre: 'Pendientes Diamante', 
    marca: 'ZERELLE', 
    precio: '$2,100', 
    imagen: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop' 
  },
];

export default function HomeScreen() {
  
  // 1. Creamos una función pequeña que solo dibuja el carrusel
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
        data={PRODUCTOS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 15 }}
        
        // 2. ¡AQUÍ ESTÁ EL TRUCO! 
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