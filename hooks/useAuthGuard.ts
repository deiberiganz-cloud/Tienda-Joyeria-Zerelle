import { selectUser } from '@/store/slices/authSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Hook para proteger acciones que requieren autenticación
 * Muestra un modal de autenticación si el usuario no está logueado
 * 
 * @returns {Object} Estado y funciones de protección
 * @returns {boolean} showAuthModal - Visibilidad del modal de autenticación
 * @returns {Function} setShowAuthModal - Controla visibilidad del modal
 * @returns {Function} requireAuth - Ejecuta una acción solo si está autenticado
 * 
 * @example
 * const { requireAuth } = useAuthGuard();
 * const handleFavorite = () => {
 *   requireAuth(() => {
 *     // Acción que requiere autenticación
 *   });
 * };
 */
export function useAuthGuard() {
  const user = useSelector(selectUser);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const requireAuth = (action: () => void) => {
    if (user) {
      // Usuario autenticado, ejecutar la acción
      action();
    } else {
      // Usuario no autenticado, mostrar modal
      setShowAuthModal(true);
    }
  };

  return { showAuthModal, setShowAuthModal, requireAuth };
}
