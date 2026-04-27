import { db } from '@/database/firebaseConfig';
import type { FavoritesState } from '@/domain/types';
import type { RootState } from '@/store';
import { selectUser } from '@/store/slices/authSlice';
import { addToFavorites, clearFavorites } from '@/store/slices/favoritesSlice';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * useFavoritesSync - Sincroniza los favoritos entre Redux y Firestore
 * 
 * Funcionalidad:
 * 1. Carga los favoritos desde Firestore cuando usuario inicia sesión
 * 2. Guarda cambios en Firestore cada vez que favoritos cambia
 * 3. Limpia los favoritos locales cuando usuario cierra sesión
 * 
 * Estructura en Firestore:
 * users/{userId}/favorites/data -> { items: FavoriteItem[] }
 */
export function useFavoritesSync() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);
  const isSyncingRef = useRef(false);
  const isLoadedRef = useRef(false);

  // Cargar favoritos desde Firestore cuando usuario se autentica
  useEffect(() => {
    if (!user?.uid) {
      // Usuario desautenticado: limpiar favoritos local
      dispatch(clearFavorites());
      return;
    }

    let isMounted = true;

    const loadFavoritesFromFirestore = async () => {
      try {
        const favoritesDocRef = doc(db, 'users', user.uid!, 'favorites', 'data');
        const favoritesSnapshot = await getDoc(favoritesDocRef);

        if (isMounted) {
          if (favoritesSnapshot.exists()) {
            const firestoreFavorites = favoritesSnapshot.data() as FavoritesState;
            
            // Limpiar favoritos local y cargar desde Firestore
            dispatch(clearFavorites());
            
            // Agregar cada item a favoritos
            if (firestoreFavorites.items && Array.isArray(firestoreFavorites.items)) {
              firestoreFavorites.items.forEach((item) => {
                dispatch(addToFavorites(item));
              });
            }
          }
          // Marcar como cargado DESPUÉS de actualizar el estado
          isLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Error al cargar favoritos desde Firestore:', error);
        if (isMounted) {
          isLoadedRef.current = true;
        }
      }
    };

    loadFavoritesFromFirestore();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, dispatch]);

  // Guardar favoritos en Firestore cuando cambian
  useEffect(() => {
    if (!user?.uid || isSyncingRef.current || !isLoadedRef.current) {
      return;
    }

    isSyncingRef.current = true;

    const saveFavoritesToFirestore = async () => {
      try {
        const favoritesDocRef = doc(db, 'users', user.uid!, 'favorites', 'data');
        const favoritesData: FavoritesState = { items: favoriteItems };
        
        await setDoc(favoritesDocRef, favoritesData, { merge: true });
      } catch (error) {
        console.error('Error al guardar favoritos en Firestore:', error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Pequeño delay para evitar múltiples escrituras rápidas
    const timeoutId = setTimeout(saveFavoritesToFirestore, 300);

    return () => {
      clearTimeout(timeoutId);
      isSyncingRef.current = false;
    };
  }, [favoriteItems, user?.uid]);
}
