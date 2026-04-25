import { FavoriteItem } from '@/domain/types';
import { useToggleFavorite } from './useToggleFavorite';

interface UseFavoriteToggleReturn {
  isFavorite: boolean;
  handleToggle: () => void;
}

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
