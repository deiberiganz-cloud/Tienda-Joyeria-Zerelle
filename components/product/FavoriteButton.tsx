import AuthModal from '@/components/auth/AuthModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface FavoriteButtonProps {
  favorited: boolean;
  onPress: () => void;
  size?: number;
}

export default function FavoriteButton({ favorited, onPress, size = 22 }: FavoriteButtonProps) {
  const { showAuthModal, setShowAuthModal, requireAuth } = useAuthGuard();

  const handlePress = () => {
    requireAuth(onPress);
  };

  return (
    <View>
      <TouchableOpacity style={styles.heartButton} onPress={handlePress}>
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={size}
          color={favorited ? '#d4af37' : '#888'}
        />
      </TouchableOpacity>
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </View>
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
