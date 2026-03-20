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
    precio: string;
    imagen: string;
  }) => void;
}

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
    precio: string;
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
