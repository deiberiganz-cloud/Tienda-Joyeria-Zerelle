import { db } from '@/database/firebaseConfig';
import { Product } from '@/domain/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 1. Referencia a la colección "products"
        const productsRef = collection(db, 'products');

        // 2. Creamos la consulta ordenada por nombre
        const q = query(productsRef, orderBy('nombre'));

        // 3. Traemos todos los documentos
        const snapshot = await getDocs(q);

        // 4. Convertimos cada documento a nuestro tipo Product
        const productsList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Product[];

        setProducts(productsList);
      } catch (err: any) {
        setError(err.message);
        console.error('Error trayendo productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}