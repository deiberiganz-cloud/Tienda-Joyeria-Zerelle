import { View, Text, StyleSheet, FlatList, Image,TouchableOpacity  } from 'react-native';
import { useSelector, useDispatch} from 'react-redux'; // 1. Importamos el "lector"
import { addToCart , decreaseQuantity, clearCart } from '../../store/slices/cartSlice'; // 2. Importamos la función para agregar al carrito
import { RootState } from '../../store/index';



export default function CartScreen() {
  // 3. Traemos los productos guardados en Redux
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Selección Zerelle 💍</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Tu carrito está esperando por una joya</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.imagen }} style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.nombre}</Text>
                <Text style={styles.itemPrice}>{item.precio}</Text>
                
                <View style={styles.quantityRow}>
                  {/* BOTÓN RESTAR - AGREGADO AQUÍ */}
                  <TouchableOpacity 
                    onPress={() => dispatch(decreaseQuantity(item.id))}
                    style={styles.addButtonMini}
                  >
                    <Text style={styles.addButtonText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}> {item.cantidad} </Text>
                  
                  {/* BOTÓN SUMAR */}
                  <TouchableOpacity 
                    onPress={() => dispatch(addToCart(item))}
                    style={styles.addButtonMini}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
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
});