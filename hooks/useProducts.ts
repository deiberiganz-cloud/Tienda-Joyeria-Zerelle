import { Product } from '@/domain/types';
import { useGetProductsQuery } from '@/store/productsApi';

/**
 * Hook para obtener la lista de productos usando RTK Query
 */
export function useProducts() {
  const { data, isLoading, error } = useGetProductsQuery();

  return {
    products: (data as Product[]) ?? [],
    loading: isLoading,
    error:
      error && typeof error === 'object' && 'error' in error
        ? String((error as any).error)
        : error
        ? 'Error al cargar productos'
        : null,
  };
}