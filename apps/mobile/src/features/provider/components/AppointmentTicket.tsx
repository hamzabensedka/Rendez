import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { providerTheme as T } from '../providerTheme';
import type { ProviderAppointment } from '../../../application/query/hooks';
import { formatClock, formatDuration, serviceLine } from '../providerFormat';
import { AtelierButton } from './AtelierButton';

interface AppointmentTicketProps {
  appointment: ProviderAppointment;
  onClose: () => void;
  onComplete: () => void;
  onNoShow: () => void;
  onCancel: () => void;
  busy?: boolean;
}

export function AppointmentTicket({
  appointment,
  onClose,
  onComplete,
  onNoShow,
  onCancel,
  busy,
}: AppointmentTicketProps) {
  const booked = appointment.status === 'BOOKED';
  return (
    <View style={styles.sheet}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{appointment.clientUser?.name ?? 'Walk-in'}</Text>
          <Text style={styles.meta}>
            {formatClock(appointment.startAtUtc)} – {formatClock(appointment.endAtUtc)}
            {appointment.staff?.name ? ` · ${appointment.staff.name}` : ''}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close ticket"
          hitSlop={8}
          style={styles.close}
        >
          <Ionicons name="close" size={20} color={T.colors.muted} />
        </Pressable>
      </View>

      <View style={styles.serviceRow}>
        <Text style={styles.service}>{serviceLine(appointment)}</Text>
        <Text style={styles.duration}>
          {formatDuration(appointment.startAtUtc, appointment.endAtUtc)}
        </Text>
      </View>

      {booked ? (
        <View style={styles.actions}>
          <AtelierButton title="Complete" onPress={onComplete} loading={busy} />
          <View style={styles.row}>
            <AtelierButton title="No-show" variant="outline" onPress={onNoShow} style={{ flex: 1 }} />
            <AtelierButton title="Cancel" variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        <Text style={styles.meta}>{appointment.status.replace('_', ' ').toLowerCase()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: T.colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.colors.rule,
    shadowColor: T.colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  top: { flexDirection: 'row', alignItems: 'flex-start' },
  name: {
    fontFamily: T.font.display,
    fontSize: 28,
    lineHeight: 32,
    color: T.colors.ink,
    letterSpacing: -0.4,
  },
  meta: {
    marginTop: 4,
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
  },
  close: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
  },
  service: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.ink },
  duration: { fontFamily: T.font.medium, fontSize: 16, color: T.colors.muted },
  actions: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
});
