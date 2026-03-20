import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Seleccionar Cantidad</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.counterBtn} onPress={onDecrease}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{cantidad}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={onIncrease}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmBtnText}>CONFIRMAR AÑADIR</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 15 }}>
            <Text style={{ color: '#888' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 40, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 25 },
  counterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  counterBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  counterBtnText: { fontSize: 20 },
  counterValue: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 30 },
  confirmBtn: { backgroundColor: '#000', width: '100%', padding: 16, borderRadius: 5, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', letterSpacing: 1 }
});
