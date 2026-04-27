import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function ZoomableImage({ uri }: { uri: string }) {
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

const styles = StyleSheet.create({
  imageClipContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden', 
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
});
