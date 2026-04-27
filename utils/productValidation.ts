export interface ValidationError {
  field: string;
  message: string;
}

export interface ProductFormData {
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
}

export const validateProduct = (data: Partial<ProductFormData>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validar nombre
  if (!data.nombre || data.nombre.trim().length === 0) {
    errors.push({ field: 'nombre', message: 'El nombre es requerido' });
  } else if (data.nombre.length < 3) {
    errors.push({ field: 'nombre', message: 'El nombre debe tener al menos 3 caracteres' });
  }

  // Validar marca
  if (!data.marca || data.marca.trim().length === 0) {
    errors.push({ field: 'marca', message: 'La marca es requerida' });
  }

  // Validar precio
  if (!data.precio || data.precio.trim().length === 0) {
    errors.push({ field: 'precio', message: 'El precio es requerido' });
  } else {
    const priceNum = parseFloat(data.precio);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push({ field: 'precio', message: 'El precio debe ser un número mayor a 0' });
    }
  }

  // Validar precio original (opcional)
  if (data.precio_original && data.precio_original.trim().length > 0) {
    const originalPrice = parseFloat(data.precio_original);
    if (isNaN(originalPrice) || originalPrice <= 0) {
      errors.push({ field: 'precio_original', message: 'El precio original debe ser un número válido' });
    }
  }

  // Validar descripción
  if (!data.descripcion || data.descripcion.trim().length === 0) {
    errors.push({ field: 'descripcion', message: 'La descripción es requerida' });
  } else if (data.descripcion.length < 10) {
    errors.push({ field: 'descripcion', message: 'La descripción debe tener al menos 10 caracteres' });
  }

  // Validar descripción técnica
  if (!data.descripcion_tecnica || data.descripcion_tecnica.trim().length === 0) {
    errors.push({ field: 'descripcion_tecnica', message: 'La descripción técnica es requerida' });
  }

  // Validar categoría
  if (!data.categoria || data.categoria.trim().length === 0) {
    errors.push({ field: 'categoria', message: 'La categoría es requerida' });
  }

  // Validar stock
  if (!data.stock || data.stock.trim().length === 0) {
    errors.push({ field: 'stock', message: 'El stock es requerido' });
  } else {
    const stockNum = parseInt(data.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      errors.push({ field: 'stock', message: 'El stock debe ser un número entero no negativo' });
    }
  }

  // Validar material
  if (!data.material || data.material.trim().length === 0) {
    errors.push({ field: 'material', message: 'El material es requerido' });
  }

  // Validar URL
  if (!data.url || data.url.trim().length === 0) {
    errors.push({ field: 'url', message: 'La URL es requerida' });
  } else {
    try {
      new URL(data.url);
    } catch {
      errors.push({ field: 'url', message: 'La URL no es válida' });
    }
  }

  return errors;
};

export const parsePrice = (priceStr: string): number => {
  const cleaned = priceStr.replace(/[$.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const formatPriceForInput = (price: number | null): string => {
  if (!price) return '';
  return price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
