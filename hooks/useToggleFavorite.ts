import { FavoriteItem } from '@/domain/types';
import { RootState } from '@/store';
import { addToFavorites, removeFromFavorites, toggleFavorite } from '@/store/slices/favoritesSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Hook para gestionar favoritos a nivel global (Redux)
 * Permite verificar, agregar, quitar y alternar favoritos
 * 
 * @returns {Object} Datos de favoritos y funciones de control
 * @returns {FavoriteItem[]} favorites - Array de productos favoritos
 * @returns {number} favoritesCount - Cantidad de favoritos
 * @returns {Function} isFavorite - Verifica si un producto está en favoritos
 * @returns {Function} toggle - Alterna el estado de un producto
 * @returns {Function} add - Agrega un producto a favoritos
 * @returns {Function} remove - Remueve un producto de favoritos
 * 
 * @example
 * const { favorites, isFavorite, toggle } = useToggleFavorite();
 * console.log(isFavorite('product-123')); // true o false
 */
export function useToggleFavorite() {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const isFavorite = useCallback((productId: string) => {
    return favorites.some((item) => item.id === productId);
  }, [favorites]);

  const toggle = useCallback((product: FavoriteItem) => {
    dispatch(toggleFavorite(product));
  }, [dispatch]);

  const add = useCallback((product: FavoriteItem) => {
    dispatch(addToFavorites(product));
  }, [dispatch]);

  const remove = useCallback((productId: string) => {
    dispatch(removeFromFavorites(productId));
  }, [dispatch]);

  const favoritesCount = favorites.length;

  return {
    favorites,
    favoritesCount,
    isFavorite,
    toggle,
    add,
    remove,
  };
}
