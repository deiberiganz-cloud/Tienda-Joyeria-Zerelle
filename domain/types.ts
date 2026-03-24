export interface ProductSummary {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
}

export interface CartItem extends ProductSummary {
  cantidad: number;
}

export interface CartState {
  items: CartItem[];
}

export interface FavoriteItem {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
  marca: string;
}

export interface FavoritesState {
  items: FavoriteItem[];
}