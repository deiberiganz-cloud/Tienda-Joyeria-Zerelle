import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Category {
  id: string;
  nombre: string;
  icono: string;
}

interface CategoryCarouselProps {
  categorias: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryCarousel({
  categorias,
  selectedCategory,
  onSelectCategory,
}: CategoryCarouselProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={categorias}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.id;
          return (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={[
                  styles.bubble,
                  isSelected && styles.bubbleActive,
                ]}
                onPress={() => onSelectCategory(item.id)}
              >
                <Text
                  style={[
                    styles.icon,
                    isSelected && styles.iconActive,
                  ]}
                >
                  {item.icono}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelActive,
                ]}
              >
                {item.nombre}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  itemContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  bubble: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  bubbleActive: {
    backgroundColor: '#000',
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  iconActive: {
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  labelActive: {
    color: '#000',
    fontWeight: '600',
  },
});
