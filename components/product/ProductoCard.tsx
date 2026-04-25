import { useAddToCart } from '@/hooks/useAddToCart';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddToCartModal from './AddToCartModal';
import FavoriteButton from './FavoriteButton';

interface Props {
  id: string;
  nombre: string;
  precio: number;
  precio_original?: number | null;
  imagen: string;
  marca: string;
}

export const ProductoCard = ({ id, nombre, precio, precio_original, imagen, marca }: Props) => {
  const { isFavorite, handleToggle } = useFavoriteToggle({ 
    id, nombre, precio, imagen, marca 
  });

  const {
    cantidad,
    modalVisible,
    openModal,
    closeModal,
    increaseQuantity,
    decreaseQuantity,
    confirmAddToCart,
  } = useAddToCart();

  const formatPrice = (value: number) => {
    return '$' + value.toLocaleString('es-CL');
  };

  const handleBuyPress = () => {
    openModal();
  };

  const handleConfirmAddToCart = () => {
    confirmAddToCart({ id, nombre, precio, imagen });
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagen }} style={styles.image} />
          <FavoriteButton favorited={isFavorite} onPress={handleToggle} size={22} />
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{nombre}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(precio)}</Text>
            {precio_original && (
              <Text style={styles.originalPrice}>
                {formatPrice(precio_original)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyPress}
            activeOpacity={0.7}
          >
            <Text style={styles.buyButtonText}>COMPRAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddToCartModal
        visible={modalVisible}
        cantidad={cantidad}
        onClose={closeModal}
        onDecrease={decreaseQuantity}
        onIncrease={increaseQuantity}
        onConfirm={handleConfirmAddToCart}
      />
    </>
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
    overflow: 'hidden',
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
  priceContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  buyButton: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
    width: '90%',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});