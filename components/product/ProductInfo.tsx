import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FavoriteButton from './FavoriteButton';

interface ProductInfoProps {
  id: string;
  marca: string;
  nombre: string;
  precio: string;
  precio_original?: string | null;
  descripcion: string;
  stock: number;
  imagen: string;
  onAddToCart: () => void;
}

export default function ProductInfo({
  id,
  marca,
  nombre,
  precio,
  precio_original,
  descripcion,
  stock,
  imagen,
  onAddToCart,
}: ProductInfoProps) {
  const { isFavorite, handleToggle } = useFavoriteToggle({ id, nombre, precio, imagen, marca });

  return (
    <View style={styles.infoContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.brand}>{marca}</Text>
          <Text style={styles.title}>{nombre}</Text>
        </View>
        <FavoriteButton favorited={isFavorite} onPress={handleToggle} size={28} />
      </View>
      {precio_original && (
        <Text style={styles.originalPrice}>{precio_original}</Text>
      )}
      <Text style={styles.price}>{precio}</Text>

      <View style={styles.divider} />

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
        {descripcion}
      </Text>

      <View style={styles.stockContainer}>
        <Ionicons name="cube-outline" size={16} color={stock > 5 ? '#22c55e' : '#f59e0b'} />
        <Text style={[styles.stockText, { color: stock > 5 ? '#22c55e' : '#f59e0b' }]}>
          {stock > 0 ? `${stock} unidades disponibles` : 'Agotado'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buyButton}
        onPress={onAddToCart}
      >
        <Text style={styles.buyButtonText}>AÑADIR A MI BOLSA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: { padding: 25 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
  },
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
});
