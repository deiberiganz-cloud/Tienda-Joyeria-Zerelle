import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface EditProfileFormProps {
  // Datos del usuario
  displayName: string;
  phoneNumber: string;
  photoURI: string | null; 
  saving: boolean;         

  
  setDisplayName: (value: string) => void;
  setPhoneNumber: (value: string) => void;

  // Acciones principales
  handleSelectProfileImage: () => void;
  handleSaveProfile: () => void;

  // Info del usuario de Redux
  user: {
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  } | null;
}
export const EditProfileForm = ({
  displayName,
  phoneNumber,
  photoURI,
  saving,
  setDisplayName,
  setPhoneNumber,
  handleSelectProfileImage,
  handleSaveProfile,
  user,
}: EditProfileFormProps) => {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>

      {/* ── HEADER ── */}
      {/* Barra superior con botón atrás y título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        {/* View vacío para centrar el título (truco de flexbox) */}
        <View style={{ width: 60 }} />
      </View>

      {/* ── AVATAR ── */}
      {/* Sección de la foto de perfil */}
      {/* ProfileAvatar ya sabe cómo mostrarse,
          solo le pasamos los datos que necesita */}
      <View style={styles.avatarSection}>
        <ProfileAvatar
          uri={photoURI}
          userName={displayName || user?.displayName || user?.email}
          onPress={handleSelectProfileImage}  // Al presionar → abre cámara/galería
          size={120}
        />
        <Text style={styles.avatarHint}>
          Toca la foto para cambiarla
        </Text>
      </View>

      {/* ── FORMULARIO ── */}
      <View style={styles.formSection}>

        {/* Campo: Nombre */}
        {/* value={displayName} → muestra el valor actual */}
        {/* onChangeText={setDisplayName} → actualiza cuando el usuario escribe */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={displayName}
            onChangeText={setDisplayName}
            placeholderTextColor="#999"
            autoCapitalize="words"  // Capitaliza cada palabra
          />
        </View>

        {/* Campo: Email (DESHABILITADO) */}
        {/* El email no se puede cambiar en Firebase fácilmente,
            por eso lo mostramos como texto, no como input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.disabledText}>{user?.email}</Text>
          </View>
          <Text style={styles.fieldHint}>El email no se puede modificar</Text>
        </View>

        {/* Campo: Teléfono */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu número"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"  // Teclado numérico en móvil
            placeholderTextColor="#999"
          />
        </View>

        {/* ── BOTONES ── */}
        <View style={styles.actionButtons}>

          {/* Botón Cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={saving}  // Deshabilitado mientras guarda
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          {/* Botón Guardar */}
          {/* Cuando saving=true muestra un spinner en vez del texto */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              // Spinner de carga
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',         // Elementos en fila horizontal
    alignItems: 'center',         // Centrados verticalmente
    justifyContent: 'space-between', // Espacio entre elementos
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
    width: 60,                    // Mismo ancho que el View vacío del otro lado
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  avatarSection: {
    alignItems: 'center',         // Centra el avatar horizontalmente
    paddingVertical: 32,
    gap: 8,
  },
  avatarHint: {
    fontSize: 12,
    color: '#999',
  },
  formSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  disabledText: {
    color: '#888',
    fontSize: 16,
  },
  fieldHint: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,                      // Ocupa la mitad del espacio disponible
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,                      // Ocupa la otra mitad
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,                 // Se ve "apagado" cuando está deshabilitado
  },
});