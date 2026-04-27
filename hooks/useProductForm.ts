import { Product } from '@/domain/types';
import {
    ProductFormData,
    ValidationError,
    validateProduct,
} from '@/utils/productValidation';
import { useState } from 'react';

export interface UseProductFormReturn {
  formValues: ProductFormData;
  errors: ValidationError[];
  isDirty: boolean;
  setFieldValue: (field: keyof ProductFormData, value: string) => void;
  validate: () => boolean;
  reset: (initialValues?: Partial<ProductFormData>) => void;
  clearErrors: () => void;
  setFormValues: (values: ProductFormData) => void;
}

/**
 * Hook para manejar formularios de productos con validación
 * Controla valores del formulario, errores y estado de cambios
 * 
 * @param {Product} [initialProduct] - Producto inicial para editar (opcional)
 * 
 * @returns {Object} Estado del formulario y funciones
 * @returns {ProductFormData} formValues - Valores actuales del formulario
 * @returns {ValidationError[]} errors - Array de errores de validación
 * @returns {boolean} isDirty - Indica si hay cambios sin guardar
 * @returns {Function} setFieldValue - Actualiza un campo específico
 * @returns {Function} validate - Valida todos los campos
 * @returns {Function} reset - Reinicia el formulario
 * @returns {Function} clearErrors - Limpia los errores
 * 
 * @example
 * const { formValues, setFieldValue, validate } = useProductForm();
 * <TextInput 
 *   value={formValues.nombre}
 *   onChange={(text) => setFieldValue('nombre', text)}
 * />
 */
const defaultFormValues: ProductFormData = {
  nombre: '',
  marca: '',
  precio: '',
  precio_original: '',
  descripcion: '',
  descripcion_tecnica: '',
  categoria: '',
  stock: '',
  material: '',
  url: '',
  imagen: '',
  imagenes: [],
};

export function useProductForm(
  initialProduct?: Product
): UseProductFormReturn {
  const initialValues = initialProduct
    ? {
        nombre: initialProduct.nombre,
        marca: initialProduct.marca,
        precio: initialProduct.precio.toString(),
        precio_original: initialProduct.precio_original?.toString() || '',
        descripcion: initialProduct.descripcion,
        descripcion_tecnica: initialProduct.descripcion_tecnica,
        categoria: initialProduct.categoria,
        stock: initialProduct.stock.toString(),
        material: initialProduct.material,
        url: initialProduct.url,
        imagen: initialProduct.imagen,
        imagenes: initialProduct.imagenes,
      }
    : defaultFormValues;

  const [formValues, setFormValues] = useState<ProductFormData>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const setFieldValue = (field: keyof ProductFormData, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);

    // Limpiar error del campo si existe
    setErrors((prev) =>
      prev.filter((err) => err.field !== field)
    );
  };

  const validate = (): boolean => {
    const validationErrors = validateProduct(formValues);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const reset = (initialValues?: Partial<ProductFormData>) => {
    setFormValues({
      ...defaultFormValues,
      ...initialValues,
    });
    setErrors([]);
    setIsDirty(false);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return {
    formValues,
    errors,
    isDirty,
    setFieldValue,
    validate,
    reset,
    clearErrors,
    setFormValues,
  };
}
