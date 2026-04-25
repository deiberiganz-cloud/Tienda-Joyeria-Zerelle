import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AuthModal from '../../../components/auth/AuthModal';
import { LogoutButton } from '../../../components/profile/LogoutButton';
import { ProfileHeader } from '../../../components/profile/ProfileHeader';
import { ProfileMenu } from '../../../components/profile/ProfileMenu';
import Colors from '../../../constants/Colors';
import { useAuthGuard } from '../../../hooks/useAuthGuard';
import { useProfile } from '../../../hooks/useProfile';

export default function ProfileScreen() {
  const { user, loading, handleLogout } = useProfile();
  const { showAuthModal, setShowAuthModal } = useAuthGuard();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.notAuthenticatedContainer}>
          <Text style={styles.notAuthTitle}>No autenticado</Text>
          <Text style={styles.notAuthDescription}>
            Inicia sesión para ver tu perfil y tus pedidos
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setShowAuthModal(true)}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
        <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader user={user} />
      <View style={styles.divider} />
      <ProfileMenu />
      <View style={styles.divider} />

      {/* BOTÓN ADMIN - solo aparece para el administrador*/}
      {user?.email === process.env.EXPO_PUBLIC_ADMIN_EMAIL && (
        <>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.adminButtonText}>⚙️ Panel Admin</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </>
      )}

      <LogoutButton onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  notAuthDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  adminButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});