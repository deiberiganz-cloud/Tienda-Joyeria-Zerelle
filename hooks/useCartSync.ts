import { db } from '@/database/firebaseConfig';
import type { CartState } from '@/domain/types';
import type { RootState } from '@/store';
import { selectUser } from '@/store/slices/authSlice';
import { addToCart, clearCart } from '@/store/slices/cartSlice';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * useCartSync - Sincroniza el carrito entre Redux y Firestore
 * 
 * Funcionalidad:
 * 1. Carga el carrito desde Firestore cuando usuario inicia sesión
 * 2. Guarda cambios en Firestore cada vez que el carrito cambia
 * 3. Limpia el carrito local cuando usuario cierra sesión
 * 
 * Estructura en Firestore:
 * users/{userId}/cart/data -> { items: CartItem[] }
 */
export function useCartSync() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isSyncingRef = useRef(false);
  const isLoadedRef = useRef(false);

  // Cargar carrito desde Firestore cuando usuario se autentica
  useEffect(() => {
    if (!user?.uid) {
      // Usuario desautenticado: limpiar carrito local
      dispatch(clearCart());
      return;
    }

    let isMounted = true;

    const loadCartFromFirestore = async () => {
      try {
        const cartDocRef = doc(db, 'users', user.uid!, 'cart', 'data');
        const cartSnapshot = await getDoc(cartDocRef);

        if (isMounted) {
          if (cartSnapshot.exists()) {
            const firestoreCart = cartSnapshot.data() as CartState;
            
            // Limpiar carrito local y cargar desde Firestore
            dispatch(clearCart());
            
            // Agregar cada item al carrito
            if (firestoreCart.items && Array.isArray(firestoreCart.items)) {
              firestoreCart.items.forEach((item) => {
                dispatch(addToCart({ ...item, cantidad: item.cantidad }));
              });
            }
          }
          // Marcar como cargado DESPUÉS de actualizar el estado
          isLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Error al cargar carrito desde Firestore:', error);
        if (isMounted) {
          isLoadedRef.current = true;
        }
      }
    };

    loadCartFromFirestore();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, dispatch]);

  // Guardar carrito en Firestore cuando cambia
  useEffect(() => {
    if (!user?.uid || isSyncingRef.current || !isLoadedRef.current) {
      return;
    }

    isSyncingRef.current = true;

    const saveCartToFirestore = async () => {
      try {
        const cartDocRef = doc(db, 'users', user.uid!, 'cart', 'data');
        const cartData: CartState = { items: cartItems };
        
        await setDoc(cartDocRef, cartData, { merge: true });
      } catch (error) {
        console.error('Error al guardar carrito en Firestore:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Pequeño delay para evitar múltiples escrituras rápidas
    const timeoutId = setTimeout(saveCartToFirestore, 300);

    return () => {
      clearTimeout(timeoutId);
      isSyncingRef.current = false;
    };
  }, [cartItems, user?.uid]);
}
