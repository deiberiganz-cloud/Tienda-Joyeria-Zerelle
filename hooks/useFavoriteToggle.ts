import { FavoriteItem } from '@/domain/types';
import { useToggleFavorite } from './useToggleFavorite';

interface UseFavoriteToggleReturn {
  isFavorite: boolean;
  handleToggle: () => void;
}

/**
 * Hook para alternar favoritos de un producto específico
 * Combina la verificación y toggle en una sola interfaz
 * 
 * @param {Object} product - Datos del producto
 * @param {string} product.id - ID único del producto
 * @param {string} product.nombre - Nombre del producto
 * @param {number} product.precio - Precio del producto
 * @param {string} product.imagen - URL de la imagen
 * @param {string} product.marca - Marca del producto
 * 
 * @returns {Object} Estado y función para alternar
 * @returns {boolean} isFavorite - Indica si el producto está en favoritos
 * @returns {Function} handleToggle - Alterna el estado de favorito
 * 
 * @example
 * const { isFavorite, handleToggle } = useFavoriteToggle(product);
 * <Button 
 *   onPress={handleToggle} 
 *   color={isFavorite ? 'red' : 'gray'}
 * />
 */
export function useFavoriteToggle(
  product: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
    marca: string;
  }
): UseFavoriteToggleReturn {
  const { isFavorite: checkFavorite, toggle } = useToggleFavorite();
  const isFavorite = checkFavorite(product.id);

  const handleToggle = () => {
    toggle(product as FavoriteItem);
  };

  return {
    isFavorite,
    handleToggle,
  };
}
