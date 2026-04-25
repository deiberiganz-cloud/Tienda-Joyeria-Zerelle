import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

interface RecommendedProductsProps {
  products: Product[];
  currentProductId: string;
}

export default function RecommendedProducts({ products, currentProductId }: RecommendedProductsProps) {
  const router = useRouter();

  const recomendados = products.filter((item) => item.id !== currentProductId).slice(0, 6);

  return (
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
            <Text style={styles.recommendPrice}>{'$' + item.precio.toLocaleString('es-CL')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  recommendContainer: { marginTop: 10 },
  recommendTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 20, paddingHorizontal: 25 },
  recommendCard: { width: 150, marginRight: 20 },
  recommendImage: { width: 150, height: 180, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 10 },
  recommendName: { fontSize: 13, color: '#333', marginBottom: 4 },
  recommendPrice: { fontSize: 13, fontWeight: 'bold', color: '#000' },
});
