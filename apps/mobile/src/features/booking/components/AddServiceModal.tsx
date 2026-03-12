import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@planity/ui';
import type { BookingCartItem } from '../types';
import type { BookingCartItemWithServiceName } from '../hooks/useBookingCart';

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  items: BookingCartItemWithServiceName[];
  onSelect: (item: BookingCartItem) => void;
}

export function AddServiceModal({
  visible,
  onClose,
  items,
  onSelect,
}: AddServiceModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.modalClose}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add another service</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.serviceVariantId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
                accessibilityLabel={`Add ${item.name}`}
                accessibilityRole="button"
              >
                <View style={styles.modalItemText}>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemMeta}>
                    {item.durationMin} min
                    {item.priceCents != null && ` • ${(item.priceCents / 100).toFixed(0)}€`}
                  </Text>
                </View>
                <Ionicons name="add-circle-outline" size={24} color={colors.light.text} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.modalEmpty}>No other services available</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
    maxHeight: '70%',
  },
  modalClose: {
    alignSelf: 'flex-end',
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  modalItemText: { flex: 1 },
  modalItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  modalItemMeta: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  modalEmpty: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
