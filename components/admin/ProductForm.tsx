import { Product } from '@/domain/types';
import { useProductForm } from '@/hooks/useProductForm';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProductFormProps {
  initialProduct?: Product;
  loading: boolean;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  initialProduct,
  loading,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const {
    formValues,
    errors,
    setFieldValue,
    validate,
    reset,
  } = useProductForm(initialProduct);

  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formValues);
      reset();
    } finally {
      setSubmitting(true);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
  };

  const renderTextInput = (
    label: string,
    field: string,
    placeholder: string,
    multiline: boolean = false,
    keyboardType: 'default' | 'numeric' | 'email-address' | 'url' = 'default'
  ) => {
    const fieldError = getFieldError(field);
    const value = formValues[field as keyof typeof formValues] || '';

    return (
      <View style={styles.fieldContainer} key={field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            multiline && styles.textArea,
            fieldError && styles.inputError,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#bbb"
          value={value as string}
          onChangeText={(text) => setFieldValue(field as any, text)}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={!loading && !submitting}
          keyboardType={keyboardType}
        />
        {fieldError && (
          <Text style={styles.errorText}>{fieldError}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialProduct ? '✏️ Editar Producto' : '➕ Crear Producto'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Sección: Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>
          {renderTextInput('Nombre', 'nombre', 'Ej: Anillo de diamante')}
          {renderTextInput('Marca', 'marca', 'Ej: ZERELLE')}
          {renderTextInput('Categoría', 'categoria', 'Ej: Anillos')}
        </View>

        {/* Sección: Precios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Precios</Text>
          <View style={styles.twoColumns}>
            <View style={styles.columnHalf}>
              {renderTextInput('Precio', 'precio', '0', false, 'numeric')}
            </View>
            <View style={styles.columnHalf}>
              {renderTextInput('Precio Original', 'precio_original', 'Opcional', false, 'numeric')}
            </View>
          </View>
        </View>

        {/* Sección: Stock y Disponibilidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock</Text>
          {renderTextInput('Cantidad en Stock', 'stock', '0', false, 'numeric')}
        </View>

        {/* Sección: Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          {renderTextInput(
            'Descripción',
            'descripcion',
            'Describe el producto en detalle...',
            true
          )}
          {renderTextInput(
            'Descripción Técnica',
            'descripcion_tecnica',
            'Especificaciones técnicas...',
            true
          )}
        </View>

        {/* Sección: Detalles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          {renderTextInput('Material', 'material', 'Ej: Oro 18K')}
          {renderTextInput('URL de Imagen', 'imagen', 'https://...', false, 'url')}
          {renderTextInput('URL del Producto', 'url', 'https://...', false, 'url')}
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading || submitting}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (loading || submitting) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {initialProduct ? 'Actualizar' : 'Crear Producto'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  form: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  textArea: {
    paddingTop: 10,
    paddingBottom: 10,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#d32f2f',
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 11,
    color: '#d32f2f',
    marginTop: 4,
    fontWeight: '500',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  columnHalf: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#000',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
