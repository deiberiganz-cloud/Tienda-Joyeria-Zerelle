import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

interface ProfileMenuProps {
  router?: any;
}

export function ProfileMenu({ router: externalRouter }: ProfileMenuProps) {
  const internalRouter = useRouter();
  const router = externalRouter || internalRouter;

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      title: 'Editar Perfil',
      icon: '✏️',
      onPress: handleEditProfile,
    },
    {
      id: 'orders',
      title: 'Mis Órdenes',
      icon: '📦',
      onPress: () => router.push('/orders'),
    },
    {
      id: 'address',
      title: 'Direcciones',
      icon: '📍',
      onPress: () => router.push('/addresses'),
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: '⚙️',
      onPress: () => router.push('/settings'),
    },
  ];

  return (
    <View style={styles.menuSection}>
      {menuItems.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={styles.menuItem}
          onPress={item.onPress}
        >
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
});
