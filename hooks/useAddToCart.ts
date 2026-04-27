import { addToCart } from '@/store/slices/cartSlice';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface UseAddToCartReturn {
  cantidad: number;
  modalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  confirmAddToCart: (producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
  }) => void;
}

/**
 * Hook para gestionar el modal de agregar al carrito
 * Controla la cantidad de productos y el estado del modal
 * 
 * @returns {Object} Estado y funciones para manejar el carrito
 * @returns {number} cantidad - Cantidad de productos a agregar (mínimo 1)
 * @returns {boolean} modalVisible - Visibilidad del modal
 * @returns {Function} openModal - Abre el modal
 * @returns {Function} closeModal - Cierra el modal y reinicia cantidad
 * @returns {Function} increaseQuantity - Aumenta la cantidad
 * @returns {Function} decreaseQuantity - Disminuye la cantidad (mín. 1)
 * @returns {Function} confirmAddToCart - Agrega el producto al carrito
 * 
 * @example
 * const { cantidad, openModal, confirmAddToCart } = useAddToCart();
 * <Button onPress={openModal}>Agregar al carrito</Button>
 */
export function useAddToCart(): UseAddToCartReturn {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    setCantidad(1);
  };

  const increaseQuantity = () => setCantidad((prev) => prev + 1);
  const decreaseQuantity = () => setCantidad((prev) => Math.max(1, prev - 1));

  const confirmAddToCart = (producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string;
  }) => {
    dispatch(
      addToCart({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad,
      })
    );
    setModalVisible(false);
    setCantidad(1);
  };

  return {
    cantidad,
    modalVisible,
    openModal,
    closeModal,
    increaseQuantity,
    decreaseQuantity,
    confirmAddToCart,
  };
}
