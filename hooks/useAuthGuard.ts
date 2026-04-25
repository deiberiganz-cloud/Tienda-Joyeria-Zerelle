import { selectUser } from '@/store/slices/authSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';

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
