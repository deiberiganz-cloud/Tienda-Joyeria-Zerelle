import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

interface Props {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
  marca: string;
}

export const ProductoCard = ({ id, nombre, precio, imagen, marca }: Props) => {
  const dispatch = useDispatch();
  const { isFavorite, toggle } = useToggleFavorite();
  const favorited = isFavorite(id);

  const handleToggleFavorite = () => {
    toggle({ id, nombre, precio, imagen, marca });
  };

  const handleQuickBuy = () => {
    // Esta función se dispara SOLAMENTE al tocar el botón negro
    dispatch(addToCart({ id, nombre, precio, imagen, }));
    alert('¡Agregado al carrito!'); 
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagen }} style={styles.image} />
        <TouchableOpacity style={styles.heartButton} onPress={handleToggleFavorite}>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? '#d4af37' : '#888'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.price}>{precio}</Text>
        
        {/* BOTÓN PEQUEÑO DE COMPRA RÁPIDA */}
        <TouchableOpacity 
          style={styles.buyButton} 
          onPress={handleQuickBuy}
          activeOpacity={0.7}
        >
          <Text style={styles.buyButtonText}>COMPRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '100%', 
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9f9f9', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  info: {
    padding: 10,
    alignItems: 'center', 
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  buyButton: {
    backgroundColor: '#000', // Negro elegante para Zerelle
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
    width: '90%',
    alignItems: 'center'
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});