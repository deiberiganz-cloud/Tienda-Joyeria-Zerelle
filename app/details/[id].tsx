import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importamos tus productos reales
import { PRODUCTS } from '@/mocks/products';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalleProducto() {
  // 1. Atrapamos el ID (por ejemplo: '1')
  const { id } = useLocalSearchParams(); 

  // 2. Buscamos el producto en tu lista
  // Usamos el id que viene de la URL para encontrarlo en tu array PRODUCTS
  const producto = PRODUCTS.find((item) => item.id === id);

  // 3. Si por alguna razón no existe, mostramos error
  if (!producto) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Producto no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Usamos producto.imagen porque así se llama en tu código de PRODUCTS */}
      <Image source={{ uri: producto.imagen }} style={styles.mainImage} />
      
      <View style={styles.infoContainer}>
        {/* Mostramos la marca: ZERELLE */}
        <Text style={styles.brand}>{producto.marca}</Text>
        
        {/* Mostramos el nombre: Anillo de Oro 18k, etc. */}
        <Text style={styles.title}>{producto.nombre}</Text>
        
        {/* Mostramos el precio: $850 */}
        <Text style={styles.price}>{producto.precio}</Text>
        
        <Text style={styles.description}>
          Una pieza exclusiva de la colección Zerelle. Elaborada con los más altos 
          estándares de calidad y diseño artesanal.
        </Text>

        {/* 4. BOTÓN DE COMPRAR (Por ahora solo estético, luego le pondremos el Modal) */}
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>COMPRAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  mainImage: { 
    width: '100%', 
    height: 450, 
    resizeMode: 'cover' 
  },
  infoContainer: { 
    padding: 25 
  },
  brand: { 
    fontSize: 12, 
    color: '#888', 
    letterSpacing: 2, 
    textTransform: 'uppercase',
    marginBottom: 5
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#000',
    marginBottom: 10
  },
  price: { 
    fontSize: 24, 
    color: '#d4af37', // Color dorado Zerelle
    fontWeight: '600',
    marginBottom: 20
  },
  description: { 
    fontSize: 16, 
    color: '#444', 
    lineHeight: 24,
    marginBottom: 30
  },
  buyButton: { 
    backgroundColor: '#000', 
    padding: 20, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  buyButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 1
  }
});