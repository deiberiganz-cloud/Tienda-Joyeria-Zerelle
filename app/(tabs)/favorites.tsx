import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FavoriteButton from '@/components/product/FavoriteButton';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggle } = useToggleFavorite();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      <Text style={styles.emptySubtitle}>
        Explora nuestros productos y guarda tus joyas favoritas
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.exploreButtonText}>EXPLORAR PRODUCTOS</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: typeof favorites[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View style={styles.heartButtonWrapper}>
        <FavoriteButton
          favorited={true}
          onPress={() => toggle(item)}
          size={24}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{item.marca}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.price}>{item.precio}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Favoritos</Text>
        {favorites.length > 0 && (
          <Text style={styles.count}>{favorites.length} productos</Text>
        )}
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  count: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 2,
    marginTop: 30,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 2,
  },
  listContent: {
    padding: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  heartButtonWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  infoContainer: {
    padding: 12,
  },
  brand: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: 'bold',
  },
});
