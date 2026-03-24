import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FavoriteButtonProps {
  favorited: boolean;
  onPress: () => void;
  size?: number;
}

export default function FavoriteButton({ favorited, onPress, size = 22 }: FavoriteButtonProps) {
  return (
    <TouchableOpacity style={styles.heartButton} onPress={onPress}>
      <Ionicons
        name={favorited ? 'heart' : 'heart-outline'}
        size={size}
        color={favorited ? '#d4af37' : '#888'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heartButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
});
