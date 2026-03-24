import { RootState } from '@/store';
import { addToCart, decreaseQuantity, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { parsePrice } from '@/src/utils/parsePrice';
import QuantitySelector from '@/components/product/QuantitySelector';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + parsePrice(item.precio) * item.cantidad, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Selección Zerelle 💍</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Tu carrito está esperando por una joya</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const subtotal = parsePrice(item.precio) * item.cantidad;
              return (
                <View style={styles.cartItem}>
                  <Image source={{ uri: item.imagen }} style={styles.itemImage} />
                  
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.nombre}</Text>
                    <Text style={styles.itemPrice}>{item.precio} x {item.cantidad}</Text>
                    <Text style={styles.itemSubtotal}>Subtotal: ${subtotal.toLocaleString('es-CL')}</Text>

                    <View style={styles.quantityRow}>
                      <QuantitySelector
                        cantidad={item.cantidad}
                        onDecrease={() => dispatch(decreaseQuantity(item.id))}
                        onIncrease={() => dispatch(addToCart(item))}
                        size="small"
                      />

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
            }}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumen de Compra</Text>
            <Text style={styles.totalText}>Total: ${total.toLocaleString('es-CL')}</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                onPress={() => dispatch(clearCart())}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => Alert.alert('Próximamente', 'El sistema de pago estará disponible pronto.')}
                style={styles.checkoutButton}
              >
                <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingTop: 60, 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    letterSpacing: 1, 
    marginBottom: 20, 
    color: '#000' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: '#888' 
  },
  listContent: { 
    paddingBottom: 30 
  },
  cartItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f9f9f9', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 12 
  },
  itemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 10, 
    marginRight: 15 
  },
  itemDetails: { 
    flex: 1 
  },
  itemName: { 
    fontSize: 16,
    fontWeight: '600', 
    color: '#333' 
  },
  itemPrice: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#000', 
    marginTop: 2 
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
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});