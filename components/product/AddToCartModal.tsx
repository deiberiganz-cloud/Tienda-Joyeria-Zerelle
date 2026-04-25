import AuthModal from '@/components/auth/AuthModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuantitySelector from './QuantitySelector';

interface AddToCartModalProps {
  visible: boolean;
  cantidad: number;
  onClose: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onConfirm: () => void;
}

export default function AddToCartModal({
  visible,
  cantidad,
  onClose,
  onDecrease,
  onIncrease,
  onConfirm,
}: AddToCartModalProps) {
  const { showAuthModal, setShowAuthModal, requireAuth } = useAuthGuard();

  const handleConfirm = () => {
    requireAuth(onConfirm);
  };

  return (
    <>
      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Cantidad</Text>
            <QuantitySelector
              cantidad={cantidad}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              size="large"
            />
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>CONFIRMAR AÑADIR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={{ marginTop: 15 }}>
              <Text style={{ color: '#888' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 40, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 25 },
  confirmBtn: { backgroundColor: '#000', width: '100%', padding: 16, borderRadius: 5, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 },
});
