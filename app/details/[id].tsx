import AddToCartModal from '@/components/product/AddToCartModal';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RecommendedProducts from '@/components/product/RecommendedProducts';
import { useAddToCart } from '@/hooks/useAddToCart';
import { PRODUCTS } from '@/mocks/products';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const cart = useAddToCart();
  const producto = PRODUCTS.find((item) => item.id === id);
  const images = producto?.imagenes || [producto?.imagen || ''];

  if (!producto) return (
    <SafeAreaView style={styles.container}><Text>Producto no encontrado</Text></SafeAreaView>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
          <ProductGallery images={images} activeIndex={activeIndex} onSelectImage={setActiveIndex} />
          <ProductInfo {...producto} onAddToCart={cart.openModal} />
          <RecommendedProducts products={PRODUCTS} currentProductId={producto.id} />
        </ScrollView>
        <AddToCartModal visible={cart.modalVisible} cantidad={cart.cantidad} onClose={cart.closeModal}
          onDecrease={cart.decreaseQuantity} onIncrease={cart.increaseQuantity}
          onConfirm={() => cart.confirmAddToCart({ id: producto.id, nombre: producto.nombre,
            precio: Number(producto.precio), imagen: images[0] })} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 4 },
});
