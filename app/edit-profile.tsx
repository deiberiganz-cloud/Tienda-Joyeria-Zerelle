import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { useEditProfile } from '@/hooks/useEditProfile';
import { StyleSheet, Text, View } from 'react-native';

export default function EditProfileScreen() {
  const props = useEditProfile();

  if (!props.user) {
    return (
      <View style={styles.container}>
        <Text>No autenticado</Text>
      </View>
    );
  }

  return <EditProfileForm {...props} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});