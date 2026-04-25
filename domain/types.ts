// ─── PRODUCTO COMPLETO ──────────────────────
export interface Product {
  id: string;
  nombre: string;
  marca: string;
  precio: number;           
  precio_original: number | null;
  imagen: string;
  imagenes: string[];
  descripcion: string;
  descripcion_tecnica: string;
  categoria: string;
  stock: number;
  material: string;
  url: string;
}

// ─── PARA LISTAS (campos mínimos) ───────────
export interface ProductSummary {
  id: string;
  nombre: string;
  marca: string;
  precio: number;
  precio_original: number | null;
  imagen: string;
  categoria: string;
  stock: number;
}

// ─── CARRITO ────────────────────────────────
export interface CartItem extends ProductSummary {
  cantidad: number;
}

export interface CartState {
  items: CartItem[];
}

// ─── FAVORITOS ──────────────────────────────
export interface FavoriteItem extends ProductSummary {}

export interface FavoritesState {
  items: FavoriteItem[];
}