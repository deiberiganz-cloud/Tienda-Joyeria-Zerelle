import { auth } from '@/database/firebaseConfig';
import { selectUser } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useImagePicker } from './useImagePicker';

export const useEditProfile = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const { openGallery, openCamera } = useImagePicker();

  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURI, setPhotoURI] = useState<string | null>(null);

  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
    if (user?.photoURL) setPhotoURI(user.photoURL);
  }, [user?.displayName, user?.photoURL]);

  const handleSelectProfileImage = async () => {
    Alert.alert('Cambiar Foto', '¿De dónde deseas obtener la foto?', [
      {
        text: 'Tomar Foto',
        onPress: async () => {
          const result = await openCamera();
          if (result.error) Alert.alert('Error', result.error);
          else if (!result.cancelled && result.uri) setPhotoURI(result.uri);
        },
      },
      {
        text: 'Galería',
        onPress: async () => {
          const result = await openGallery();
          if (result.error) Alert.alert('Error', result.error);
          else if (!result.cancelled && result.uri) setPhotoURI(result.uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    setSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
          photoURL: photoURI || undefined,
        });
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return {
    user, saving, displayName, phoneNumber,
    photoURI, setDisplayName, setPhoneNumber,
    handleSelectProfileImage, handleSaveProfile,
  };
};