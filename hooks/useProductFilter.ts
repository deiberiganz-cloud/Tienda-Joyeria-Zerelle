import { Product } from '@/domain/types';
import { CATEGORIAS } from '@/mocks/categories';
import { useMemo, useState } from 'react';

/**
 * Hook para filtrar productos por categoría
 * Utiliza useMemo para optimizar el rendimiento
 * 
 * @param {Product[]} products - Array de todos los productos
 * 
 * @returns {Object} Productos filtrados y funciones de control
 * @returns {Product[]} filteredProducts - Productos filtrados por categoría
 * @returns {string} selectedCategory - ID de categoría seleccionada
 * @returns {Function} setSelectedCategory - Cambia la categoría activa
 * 
 * @example
 * const { filteredProducts, selectedCategory, setSelectedCategory } = useProductFilter(products);
 * <ScrollView horizontal>
 *   {CATEGORIAS.map(cat => (
 *     <Button
 *       onPress={() => setSelectedCategory(cat.id)}
 *       selected={selectedCategory === cat.id}
 *     />
 *   ))}
 * </ScrollView>
 */
export function useProductFilter(products: Product[]) {
  const [selectedCategory, setSelectedCategory] = useState('1'); // 'All' por defecto

  const filteredProducts = useMemo(() => {
    if (selectedCategory === '1') {
      return products;
    }

    const selectedCategoryName = CATEGORIAS.find(cat => cat.id === selectedCategory)?.nombre;
    if (!selectedCategoryName) {
      return products;
    }

    return products.filter(product => product.categoria === selectedCategoryName);
  }, [products, selectedCategory]);

  return {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
  };
}
