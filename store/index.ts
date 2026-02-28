import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice'; // Importamos el "manual" del carrito

// Aquí es donde creamos el "cerebro" de nuestra tienda, diciéndole qué "manuales" usar

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Aquí le decimos al cerebro: "Tú manejas el carrito así"
  },
});

// Esto es para que TypeScript sepa qué hay dentro del cerebro (ayuda a evitar errores)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;