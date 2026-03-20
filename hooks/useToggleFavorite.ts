import { FavoriteItem } from '@/domain/types';
import { toggleFavorite, removeFromFavorites, addToFavorites } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
