import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuantitySelectorProps {
  cantidad: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: 'small' | 'large';
}

export default function QuantitySelector({
  cantidad,
  onDecrease,
  onIncrease,
  size = 'small',
}: QuantitySelectorProps) {
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <TouchableOpacity
        style={[styles.button, isSmall && styles.buttonSmall]}
        onPress={onDecrease}
      >
        <Text style={[styles.buttonText, isSmall && styles.buttonTextSmall]}>-</Text>
      </TouchableOpacity>

      <Text style={[styles.cantidad, isSmall && styles.cantidadSmall]}>{cantidad}</Text>

      <TouchableOpacity
        style={[styles.button, isSmall && styles.buttonSmall]}
        onPress={onIncrease}
      >
        <Text style={[styles.buttonText, isSmall && styles.buttonTextSmall]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  containerSmall: {
    marginBottom: 0,
    marginTop: 8,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmall: {
    marginLeft: 15,
    backgroundColor: '#000',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 20,
  },
  buttonTextSmall: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  cantidad: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 30,
  },
  cantidadSmall: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});
