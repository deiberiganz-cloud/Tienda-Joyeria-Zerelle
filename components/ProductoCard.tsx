import { View, Text, StyleSheet, TouchableOpacity ,Image } from 'react-native';

// Definimos qué datos necesita este componente para funcionar
interface Props {
  nombre: string;
  precio: string;
  imagen: string; 
}

export function ProductoCard({ nombre, precio, imagen, }: Props) {
  return (
    <View style={styles.card}>
      {/* Mostramos la imagen (obligatoria) */}
      <Image source={{ uri: imagen }} style={styles.image} />

      <View>
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.price}>{precio}</Text>
             </View>
             
      <TouchableOpacity style={styles.button} onPress={() => alert('Añadido')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20, 
    backgroundColor: '#beb0a0', 
    borderRadius: 15, 
    marginBottom: 15,
    marginHorizontal: 10,
    // Sombra para que resalte
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, color: '#2ecc71', marginTop: 4, fontWeight: '600' },
  button: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  
image: {
    width: 60,       // Tamaño de la foto
    height: 60,
    borderRadius: 10,
    marginRight: 10,  // Espacio con el texto
  },
  stikerText: {
    fontSize: 12,
    color: '#e74c3c', // Un rojo para que resalte
    fontWeight: 'bold',
    marginTop: 2,
  }
});