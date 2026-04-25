import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

interface ProfileAvatarProps {
  /** URI de la imagen del avatar (null si no hay imagen) */
  uri: string | null;
  /** Nombre del usuario para mostrar la inicial como placeholder */
  userName?: string;
  /** Callback cuando se presiona el botón de editar */
  onPress: () => void;
  /** Tamaño del avatar en píxeles (por defecto 120) */
  size?: number;
}

/**
 * Componente de avatar circular para el perfil del usuario
 * Muestra imagen, placeholder con inicial, o ícono de cámara para editar
 */
export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  uri,
  userName = 'U',
  onPress,
  size = 120,
}) => {
  const avatarSize = size;
  const borderRadius = size / 2;
  const iconSize = size * 0.3;

  return (
    <View style={[styles.container, { width: avatarSize, height: avatarSize }]}>
      {/* Avatar Image o Placeholder */}
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
            },
          ]}
          defaultSource={require('../../assets/images/icon.png')}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
            },
          ]}
        >
          <Text
            style={[
              styles.placeholderText,
              { fontSize: size * 0.4 },
            ]}
          >
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Edit Button */}
      <TouchableOpacity
        style={[
          styles.editButton,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: iconSize * 0.6 }}>📷</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    backgroundColor: Colors.light.background,
  },
  placeholder: {
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
