import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Definimos qué datos tiene una Joya
interface CartItem {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Esta función agrega productos al carrito
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'cantidad'>>) => {
      const itemExists = state.items.find((item) => item.id === action.payload.id);

      if (itemExists) {
        itemExists.cantidad += 1; // Si ya está, sumamos 1
      } else {
        state.items.push({ ...action.payload, cantidad: 1 }); // Si es nuevo, lo agregamos
      }
    },
    // Función para vaciar el carrito
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;