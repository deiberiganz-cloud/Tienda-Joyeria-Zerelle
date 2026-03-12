import { PRODUCTS } from '@/mocks/products';
import { addToCart } from '@/store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

// Componente de Imagen con Zoom
function ZoomableImage({ uri }: { uri: string }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      // CLAMPING: Restringir escala entre 1 y 5 durante el gesture
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, 1), 5);
    })
    .onEnd(() => {
      // Si la escala es menor a 1, resetear a 1
      if (scale.value < 1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
      // Si la escala es mayor a 5, limitar a 5
      if (scale.value > 5) {
        scale.value = withSpring(5);
      }
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      if (scale.value > 1) {
        translateX.value = context.value.x + event.translationX;
        translateY.value = context.value.y + event.translationY;
      }
    })
    .onEnd(() => {
      if (scale.value === 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        // RESET: Volver a escala 1 de forma animada
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = 1;
      } else {
        // Zoom a 2x con doble tap
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Exclusive(panGesture, doubleTapGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    // CONTENEDOR CON RECORTE (CLIPPING)
    <View style={styles.imageClipContainer}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.zoomableContainer, animatedStyle]}>
          <Image source={{ uri }} style={styles.mainImage} resizeMode="contain" />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default function DetalleProducto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Estado para la galería de imágenes
  const [activeIndex, setActiveIndex] = useState(0);

  // Estados para el Modal de cantidad
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  const producto = PRODUCTS.find((item) => item.id === id);

  // Filtramos para el carrusel (excluimos el actual)
  const recomendados = PRODUCTS.filter((item) => item.id !== id).slice(0, 6);

  if (!producto) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Producto no encontrado</Text>
      </SafeAreaView>
    );
  }

  // Array de imágenes del producto (usa imagenes si existe, sino usa imagen única)
  const productImages = producto.imagenes || [producto.imagen];

  const handleConfirmarCompra = () => {
    dispatch(addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: productImages[0],
    }));
    setModalVisible(false);
    setCantidad(1); // Reset
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* BOTÓN VOLVER (Overlay) */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>

          {/* GALERÍA DE IMÁGENES */}
          <View style={styles.galleryContainer}>
            {/* Imagen Principal con Zoom */}
            <ZoomableImage uri={productImages[activeIndex]} />
          </View>

          {/* Carrusel de Miniaturas - DEBAJO de la imagen */}
          {productImages.length > 1 && (
            <View style={styles.thumbnailsWrapper}>
              <FlatList
                data={productImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.thumbnailsContent}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => setActiveIndex(index)}
                    style={[
                      styles.thumbnailContainer,
                      index === activeIndex && styles.thumbnailActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.brand}>{producto.marca}</Text>
            <Text style={styles.title}>{producto.nombre}</Text>
            {producto.precio_original && (
              <Text style={styles.originalPrice}>{producto.precio_original}</Text>
            )}
            <Text style={styles.price}>{producto.precio}</Text>

            <View style={styles.divider} />

            {/* ICONOS DE CONFIANZA */}
            <View style={styles.trustSection}>
              <View style={styles.trustItem}>
                <Ionicons name="gift" size={20} color="#888" />
                <Text style={styles.trustText}>Empaque Premium</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#888" />
                <Text style={styles.trustText}>Certificado 18k</Text>
              </View>
            </View>

            <Text style={styles.description}>
              {producto.descripcion}
            </Text>

            {/* Indicador de stock */}
            <View style={styles.stockContainer}>
              <Ionicons name="cube-outline" size={16} color={producto.stock > 5 ? '#22c55e' : '#f59e0b'} />
              <Text style={[styles.stockText, { color: producto.stock > 5 ? '#22c55e' : '#f59e0b' }]}>
                {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Agotado'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buyButtonText}>AÑADIR A MI BOLSA</Text>
            </TouchableOpacity>
          </View>

          {/* --- CARRUSEL: OTRAS PERSONAS TAMBIÉN COMPRARON --- */}
          <View style={styles.recommendContainer}>
            <Text style={styles.recommendTitle}>OTRAS PERSONAS TAMBIÉN COMPRARON</Text>
            <FlatList
              data={recomendados}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 25 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recommendCard}
                  onPress={() => router.push(`/details/${item.id}`)}
                >
                  <Image source={{ uri: item.imagen }} style={styles.recommendImage} />
                  <Text style={styles.recommendName} numberOfLines={1}>{item.nombre}</Text>
                  <Text style={styles.recommendPrice}>{item.precio}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>

        {/* MODAL DE SELECCIÓN DE CANTIDAD */}
        <Modal animationType="slide" transparent visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Cantidad</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity style={styles.counterBtn} onPress={() => setCantidad(Math.max(1, cantidad - 1))}>
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{cantidad}</Text>
                <TouchableOpacity style={styles.counterBtn} onPress={() => setCantidad(cantidad + 1)}>
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmarCompra}>
                <Text style={styles.confirmBtnText}>CONFIRMAR AÑADIR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15 }}>
                <Text style={{ color: '#888' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 4 },

  // GALERÍA DE IMÁGENES
  galleryContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#f9f9f9',
  },
  // CONTENEDOR CON RECORTE (CLIPPING) - Evita que la imagen se desborde
  imageClipContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden', // ← CLIPPING: La imagen solo es visible dentro de este cuadro
  },
  zoomableContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },

  // MINIATURAS - AHORA DEBAJO
  thumbnailsWrapper: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  thumbnailsContent: {
    paddingHorizontal: 5,
    gap: 10,
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  thumbnailActive: {
    borderColor: '#d4af37', // Color dorado del precio
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  infoContainer: { padding: 25 },
  brand: { fontSize: 12, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: { fontSize: 24, color: '#d4af37', fontWeight: '700', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  trustSection: { flexDirection: 'row', marginBottom: 25 },
  trustItem: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
  trustText: { fontSize: 12, color: '#666', marginLeft: 6 },
  description: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 20 },

  // STOCK
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  stockText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },

  buyButton: { backgroundColor: '#000', padding: 18, borderRadius: 2, alignItems: 'center' },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 },

  // ESTILOS CARRUSEL
  recommendContainer: { marginTop: 10 },
  recommendTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 20, paddingHorizontal: 25 },
  recommendCard: { width: 150, marginRight: 20 },
  recommendImage: { width: 150, height: 180, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 10 },
  recommendName: { fontSize: 13, color: '#333', marginBottom: 4 },
  recommendPrice: { fontSize: 13, fontWeight: 'bold', color: '#000' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 40, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 25 },
  counterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  counterBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  counterBtnText: { fontSize: 20 },
  counterValue: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 30 },
  confirmBtn: { backgroundColor: '#000', width: '100%', padding: 16, borderRadius: 5, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 }
});
