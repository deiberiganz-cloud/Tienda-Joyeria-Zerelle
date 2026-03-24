import type { CartItem, CartState, ProductSummary } from '@/domain/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductSummary & { cantidad?: number }>) => {
  const itemExists = state.items.find((item) => item.id === action.payload.id);

  if (itemExists) {
    itemExists.cantidad += action.payload.cantidad ?? 1;
  } else {
    const newItem: CartItem = { 
      ...action.payload, 
      cantidad: action.payload.cantidad ?? 1
    };
    state.items.push(newItem);
  }
},
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        if (item.cantidad > 1) {
          item.cantidad -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

import { RootState } from '@/store';
import { parsePrice } from '@/src/utils/parsePrice';

export const selectCartTotal = (state: RootState): number => {
  return state.cart.items.reduce((sum, item) => sum + parsePrice(item.precio) * item.cantidad, 0);
};

