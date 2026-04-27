import { db } from '@/database/firebaseConfig';
import { Product } from '@/domain/types';
import { parsePrice } from '@/utils/productValidation';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * Hook para gestionar operaciones administrativas de productos
 * Incluye CRUD completo y sincronización con Firestore
 * 
 * @returns {Object} Productos, estado y funciones administrativas
 * @returns {Product[]} products - Lista de todos los productos
 * @returns {boolean} loading - Estado de carga
 * @returns {string|null} error - Mensaje de error si ocurre
 * @returns {Function} getProducts - Recarga la lista de productos
 * @returns {Function} createProduct - Crea un nuevo producto
 * @returns {Function} updateProduct - Actualiza un producto existente
 * @returns {Function} deleteProduct - Elimina un producto
 * 
 * @example
 * const { products, createProduct, deleteProduct } = useProductAdmin();
 * await createProduct({
 *   nombre: 'Nuevo producto',
 *   precio: '99.99',
 *   ...
 * });
 */
export interface AdminFormData {
  nombre: string;
  marca: string;
  precio: string;
  precio_original: string;
  descripcion: string;
  descripcion_tecnica: string;
  categoria: string;
  stock: string;
  material: string;
  url: string;
  imagen: string;
  imagenes: string[];
}

export interface UseProductAdminReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProducts: () => Promise<void>;
  createProduct: (data: AdminFormData) => Promise<string>;
  updateProduct: (id: string, data: AdminFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export function useProductAdmin(): UseProductAdminReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('nombre'));
      const snapshot = await getDocs(q);

      const productsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Product[];

      setProducts(productsList);
    } catch (err: any) {
      const errorMsg = err.message || 'Error cargando productos';
      setError(errorMsg);
      console.error('Error en getProducts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (data: AdminFormData): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const productData: Product = {
        id: '', // Firestore lo asignará
        nombre: data.nombre,
        marca: data.marca,
        precio: parsePrice(data.precio),
        precio_original: data.precio_original ? parsePrice(data.precio_original) : null,
        descripcion: data.descripcion,
        descripcion_tecnica: data.descripcion_tecnica,
        categoria: data.categoria,
        stock: parseInt(data.stock) || 0,
        material: data.material,
        url: data.url,
        imagen: data.imagen,
        imagenes: data.imagenes || [data.imagen],
      };

      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, productData);

      // Actualizar el documento con su propio ID
      await updateDoc(docRef, { id: docRef.id });

      // Recargar lista
      await getProducts();

      return docRef.id;
    } catch (err: any) {
      const errorMsg = err.message || 'Error creando producto';
      setError(errorMsg);
      console.error('Error en createProduct:', err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: AdminFormData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const productData: Partial<Product> = {
        nombre: data.nombre,
        marca: data.marca,
        precio: parsePrice(data.precio),
        precio_original: data.precio_original ? parsePrice(data.precio_original) : null,
        descripcion: data.descripcion,
        descripcion_tecnica: data.descripcion_tecnica,
        categoria: data.categoria,
        stock: parseInt(data.stock) || 0,
        material: data.material,
        url: data.url,
        imagen: data.imagen,
        imagenes: data.imagenes || [data.imagen],
      };

      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, productData);

      // Recargar lista
      await getProducts();
    } catch (err: any) {
      const errorMsg = err.message || 'Error actualizando producto';
      setError(errorMsg);
      console.error('Error en updateProduct:', err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);

      // Actualizar lista localmente
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      const errorMsg = err.message || 'Error eliminando producto';
      setError(errorMsg);
      console.error('Error en deleteProduct:', err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    loading,
    error,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
