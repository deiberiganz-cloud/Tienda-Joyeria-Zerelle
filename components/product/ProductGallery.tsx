import React from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ZoomableImage from './ZoomableImage';

interface ProductGalleryProps {
  images: string[];
  activeIndex: number;
  onSelectImage: (index: number) => void;
}

export default function ProductGallery({ images, activeIndex, onSelectImage }: ProductGalleryProps) {
  return (
    <View>
      {/* GALERÍA DE IMÁGENES */}
      <View style={styles.galleryContainer}>
        {/* Imagen Principal con Zoom */}
        <ZoomableImage uri={images[activeIndex]} />
      </View>

      {/* Carrusel de Miniaturas - DEBAJO de la imagen */}
      {images.length > 1 && (
        <View style={styles.thumbnailsWrapper}>
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.thumbnailsContent}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => onSelectImage(index)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  galleryContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#f9f9f9',
  },
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
});
