import { db } from '@/database/firebaseConfig';
import { PRODUCTS_TO_UPLOAD } from '@/mocks/products';
import { useRouter } from 'expo-router';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AdminScreen() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // Convierte '$44.900' → 44900
  const parsePrice = (precio: string | null): number | null => {
    if (!precio) return null;
    return parseInt(precio.replace(/[$.,\s]/g, ''), 10);
  };

  const handleUploadProducts = async () => {
    Alert.alert(
      'Subir Productos',
      `¿Confirmás subir ${PRODUCTS_TO_UPLOAD.length} productos a Firestore?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setUploading(true);
            setResults([]);
            const newResults: string[] = [];

            try {
              for (const product of PRODUCTS_TO_UPLOAD) {

                // Convertir precios string → número
                const productToSave = {
                  ...product,
                  precio: parsePrice(product.precio) ?? 0,
                  precio_original: parsePrice(product.precio_original),
                };

                // Guardar en Firestore
                // collection(db, 'products') → carpeta products
                // doc(..., product.id) → documento con ese id
                await setDoc(
                  doc(collection(db, 'products'), product.id),
                  productToSave
                );

                const msg = `✅ ${product.nombre.slice(0, 35)}...`;
                newResults.push(msg);
                // Actualiza la lista en tiempo real
                setResults([...newResults]);
              }

              newResults.push('🎉 ¡Todos los productos subidos!');
              setResults([...newResults]);

            } catch (error: any) {
              newResults.push(`❌ Error: ${error.message}`);
              setResults([...newResults]);
            } finally {
              setUploading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Panel Admin</Text>
      </View>

      {/* Sección productos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Productos</Text>
        <Text style={styles.sectionInfo}>
          {PRODUCTS_TO_UPLOAD.length} productos listos para subir a Firestore
        </Text>

        <TouchableOpacity
          style={[styles.button, uploading && styles.buttonDisabled]}
          onPress={handleUploadProducts}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>⬆️ Subir productos</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Log de resultados */}
      {results.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.sectionTitle}>📋 Resultado</Text>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultText}>{result}</Text>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    gap: 4,
  },
  back: { fontSize: 14, color: '#666' },
  title: { fontSize: 24, fontWeight: 'bold' },
  section: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  sectionInfo: { fontSize: 14, color: '#666' },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  results: { padding: 16, gap: 6 },
  resultText: { fontSize: 13, color: '#333' },
});