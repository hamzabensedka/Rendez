import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BookingCartItem } from '../types';
import type { BookingCartItemWithServiceName } from '../hooks/useBookingCart';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  items: BookingCartItemWithServiceName[];
  onSelect: (item: BookingCartItem) => void;
}

export function AddServiceModal({ visible, onClose, items, onSelect }: AddServiceModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalContent}>
          <Pressable
            onPress={onClose}
            style={styles.modalClose}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={22} color={T.colors.ink} />
          </Pressable>
          <Text style={styles.modalTitle}>Add another</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.serviceVariantId}
            renderItem={({ item }) => (
              <Pressable
                style={styles.modalItem}
                onPress={() => onSelect(item)}
                accessibilityLabel={`Add ${item.name}`}
                accessibilityRole="button"
              >
                <View style={styles.modalItemText}>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemMeta}>
                    {item.durationMin} min
                    {item.priceCents != null ? `  ${(item.priceCents / 100).toFixed(0)}€` : ''}
                  </Text>
                </View>
                <Text style={styles.add}>Add</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.modalEmpty}>No other services available</Text>}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 20, 18, 0.28)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: T.colors.paper,
    borderTopLeftRadius: T.radius.card,
    borderTopRightRadius: T.radius.card,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  modalTitle: {
    fontFamily: T.font.display,
    fontSize: 24,
    color: T.colors.ink,
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    gap: 12,
  },
  modalItemText: { flex: 1 },
  modalItemName: {
    fontFamily: T.font.medium,
    fontSize: 16,
    color: T.colors.ink,
  },
  modalItemMeta: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    marginTop: 2,
  },
  add: {
    fontFamily: T.font.medium,
    fontSize: 14,
    color: T.colors.ink,
  },
  modalEmpty: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    paddingVertical: 24,
  },
});
