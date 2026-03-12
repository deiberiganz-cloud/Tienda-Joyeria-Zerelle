import { StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Favoritos</Text>
      <Text style={styles.subtitle}>Guarda tus joyas favoritas</Text>
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
