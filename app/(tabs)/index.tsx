import { StyleSheet, FlatList, View, Text,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductoCard } from '@/components/ProductoCard';
// Estos son los datos de tu tienda Zerelle
const PRODUCTOS = [
  { 
    id: '1', 
    nombre: 'Anillo Brillante', 
    marca: 'ZERELLE', 
    precio: '$1,200', 
    imagen: 'https://cdn-images.dzcdn.net/images/cover/...] ' // Usa tus links de imagen
  },
  { 
    id: '2', 
    nombre: 'Reloj de Oro', 
    marca: 'CARTIER', 
    precio: '$3,500', 
    imagen: '...' 
  },
  { 
    id: '3', 
    nombre: 'Collar de Perlas', 
    marca: 'ZERELLE', 
    precio: '$850', 
    imagen: '...' 
  },
  { 
    id: '4', 
    nombre: 'Brazalete Plata', 
    marca: 'TIFFANY', 
    precio: '$1,100', 
    imagen: '...' 
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.brand}>ZERELLE</Text>
        <Text style={styles.subtitle}>Nueva Colección</Text>
      </View>

      <FlatList
        data={PRODUCTOS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          // Usamos el componente ProductoCard para cada item
          <ProductoCard nombre={item.nombre}
           precio={item.precio}
           imagen={item.imagen}
           />
        )}
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
  }
});