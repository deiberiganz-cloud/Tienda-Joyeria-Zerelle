import { View, Text, StyleSheet, Image } from 'react-native';

// Definimos qué datos necesita este componente para funcionar
interface Props {
  nombre: string;
  marca: string; 
  precio: string;
  imagen: string;
}

export const ProductoCard = ({ nombre, marca, precio, imagen }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imagen }} style={styles.image} />
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{marca}</Text>
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.price}>{precio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '48%', // Esto permite que entren 2 por fila con el space-between del index
    marginBottom: 20,
    borderRadius: 15,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9f9f9', // Fondo gris claro elegante
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  brand: {
    fontSize: 10,
    color: '#888',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Estilo de marca profesional
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 2,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
});