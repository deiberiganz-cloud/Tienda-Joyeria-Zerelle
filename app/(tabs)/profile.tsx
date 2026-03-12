import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Zerelle</Text>
      <Text style={styles.subtitle}>Gestiona tu cuenta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8
  }
});
