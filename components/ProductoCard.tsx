import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice'; // Ajusta la ruta si es necesario

interface Props {
  nombre: string;
  precio: string;
  imagen: string;
}

export const ProductoCard = ({ nombre, precio, imagen }: Props) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity style={styles.card}
     activeOpacity={0.8}
      onPress={() => dispatch(addToCart({id: String(Date.now()), nombre, precio, imagen }))}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagen }} style={styles.image} />
        
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.price}>{precio}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '48%', 
    marginBottom: 20,
    borderRadius: 15,
    // Sombra sutil para dar profundidad de lujo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9f9f9', 
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center', // Centramos el texto para un look más minimalista
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 4,
  },
});