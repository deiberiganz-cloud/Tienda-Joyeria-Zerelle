import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

interface ImagePickerResult {
  uri: string | null;
  cancelled: boolean;
  error: string | null;
}

/**
 * Hook para seleccionar imágenes desde la galería o cámara
 * Gestiona automáticamente los permisos del dispositivo
 * 
 * @returns {Object} Funciones para acceder a galería y cámara
 * @returns {Function} openGallery - Abre la galería de fotos del dispositivo
 * @returns {Function} openCamera - Abre la cámara para tomar fotos
 * 
 * @example
 * const { openGallery, openCamera } = useImagePicker();
 * const result = await openGallery();
 * if (!result.error && result.uri) {
 *   setProfileImage(result.uri);
 * }
 */
export const useImagePicker = () => {
  /**
   * Solicita permisos de cámara
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos de cámara:', error);
      return false;
    }
  }, []);

  /**
   * Solicita permisos de galería
   */
  const requestGalleryPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos de galería:', error);
      return false;
    }
  }, []);

  /**
   * Abre la galería de fotos
   * Calidad de compresión: 0.8 (80%)
   */
  const openGallery = useCallback(async (): Promise<ImagePickerResult> => {
    try {
      // Solicitar permisos
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        return {
          uri: null,
          cancelled: true,
          error: 'Permiso de galería denegado',
        };
      }

      // Abrir selector de imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Aspecto cuadrado para avatar
        quality: 0.8,
      });

      if (result.cancelled) {
        return {
          uri: null,
          cancelled: true,
          error: null,
        };
      }

      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) {
        return {
          uri: null,
          cancelled: false,
          error: 'No se pudo obtener la URI de la imagen',
        };
      }

      return {
        uri: imageUri,
        cancelled: false,
        error: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al abrir galería:', error);
      return {
        uri: null,
        cancelled: false,
        error: errorMessage,
      };
    }
  }, [requestGalleryPermission]);

  /**
   * Abre la cámara para tomar una foto
   * Calidad de compresión: 0.8 (80%)
   */
  const openCamera = useCallback(async (): Promise<ImagePickerResult> => {
    try {
      // Solicitar permisos
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return {
          uri: null,
          cancelled: true,
          error: 'Permiso de cámara denegado',
        };
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Aspecto cuadrado para avatar
        quality: 0.8,
      });

      if (result.cancelled) {
        return {
          uri: null,
          cancelled: true,
          error: null,
        };
      }

      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) {
        return {
          uri: null,
          cancelled: false,
          error: 'No se pudo obtener la URI de la imagen',
        };
      }

      return {
        uri: imageUri,
        cancelled: false,
        error: null,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al abrir cámara:', error);
      return {
        uri: null,
        cancelled: false,
        error: errorMessage,
      };
    }
  }, [requestCameraPermission]);

  return {
    openGallery,
    openCamera,
  };
};
