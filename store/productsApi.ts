import { db } from '@/database/firebaseConfig';
import type { Product } from '@/domain/types';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      async queryFn() {
        try {
          const productsRef = collection(db, 'products');
          const q = query(productsRef, orderBy('nombre'));
          const snapshot = await getDocs(q);

          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];

          return { data };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;