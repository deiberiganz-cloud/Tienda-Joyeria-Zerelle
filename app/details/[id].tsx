import { PRODUCTS } from '@/mocks/products';
import { addToCart } from '@/store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');

export default function DetalleProducto() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const dispatch = useDispatch();

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

  const handleConfirmarCompra = () => {
    dispatch(addToCart({ 
      id: producto.id, 
      nombre: producto.nombre, 
      precio: producto.precio, 
      imagen: producto.imagen,
    }));
    setModalVisible(false);
    setCantidad(1); // Reset
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* BOTÓN VOLVER (Overlay) */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>

        <Image source={{ uri: producto.imagen }} style={styles.mainImage} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{producto.marca}</Text>
          <Text style={styles.title}>{producto.nombre}</Text>
          <Text style={styles.price}>{producto.precio}</Text>
          
          <View style={styles.divider} />

          {/* ICONOS DE CONFIANZA TIPO ASOS */}
         <View style={styles.trustSection}>
  <View style={styles.trustItem}>
    {/* Cambiado a nombres más compatibles */}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 4 },
  mainImage: { width: '100%', height: 450, resizeMode: 'contain', backgroundColor: '#f9f9f9' },
  infoContainer: { padding: 25 },
  brand: { fontSize: 12, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#000', marginBottom: 10 },
  price: { fontSize: 22, color: '#d4af37', fontWeight: '700', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 20 },
  trustSection: { flexDirection: 'row', marginBottom: 25 },
  trustItem: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
  trustText: { fontSize: 12, color: '#666', marginLeft: 6 },
  description: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 30 },
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