import { CartItem as CartItemType } from '@/domain/types';
import { addToCart, decreaseQuantity, removeFromCart } from '@/store/slices/cartSlice';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useDispatch();
  const subtotal = item.precio * item.cantidad;

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imagen }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text style={styles.itemPrice}>{'$' + item.precio.toLocaleString('es-CL')} x {item.cantidad}</Text>
        <Text style={styles.itemSubtotal}>Subtotal: ${subtotal.toLocaleString('es-CL')}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            onPress={() => dispatch(decreaseQuantity(item.id))}
            style={styles.addButtonMini}
          >
            <Text style={styles.addButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}> {item.cantidad} </Text>

          <TouchableOpacity
            onPress={() => dispatch(addToCart(item))}
            style={styles.addButtonMini}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(item.id))}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  addButtonMini: {
    marginLeft: 15,
    backgroundColor: '#000',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  removeButton: {
    marginLeft: 15,
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
