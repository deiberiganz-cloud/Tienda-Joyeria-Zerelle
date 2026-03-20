// Este es el molde para un producto individual
export interface ProductSummary {
  id: string;
  nombre: string;
 precio: number;
  imagen: string; // El ? significa que la imagen es opcional
}

// Este es el molde para un producto cuando ya está en el carrito (incluye cantidad)
export interface CartItem extends ProductSummary {
  cantidad: number;
}

// Este es el molde para el estado global del carrito
export interface CartState {
  items: CartItem[];
}