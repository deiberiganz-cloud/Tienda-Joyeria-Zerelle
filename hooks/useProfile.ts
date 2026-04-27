import { auth } from '@/database/firebaseConfig';
import { clearUser, selectUser, setUser } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Hook para gestionar el estado de autenticación y datos del usuario
 * Sincroniza el estado con Firebase Authentication
 * 
 * @returns {Object} Datos de usuario y funciones
 * @returns {User|null} user - Datos del usuario autenticado o null
 * @returns {boolean} loading - Estado de carga
 * @returns {Function} handleLogout - Cierra sesión y redirige al login
 * 
 * @example
 * const { user, handleLogout } = useProfile();
 * if (user) {
 *   <Text>Bienvenido {user.displayName}</Text>
 *   <Button onPress={handleLogout}>Cerrar sesión</Button>
 * }
 */
export function useProfile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        dispatch(setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        }));
      } else {
        dispatch(clearUser());
      }
    });
    
    return unsubscribe;
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return { user, loading: false, handleLogout };
}
