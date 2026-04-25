import { CartItem } from '@/components/CartItem';
import { RootState } from '@/store';
import { clearCart, selectCartTotal } from '@/store/slices/cartSlice';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector(selectCartTotal);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Selección Zerelle</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Tu carrito está esperando por una joya</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartItem item={item} />}
            contentContainerStyle={styles.listContent}
          />

          {/* Resumen del carrito */}
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 20,
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  listContent: {
    paddingBottom: 30,
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
