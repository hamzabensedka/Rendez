import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  useWindowDimensions,
  Modal,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDatePickerDayLabel, generateIdempotencyKey } from '@planity/shared';
import { colors, spacing } from '@planity/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../../shared/lib/api';
import { useAuth } from '../../../application/providers';
import { useBookingData } from '../hooks/useBookingData';
import { DEFAULT_SALON_IMAGES } from '../../search/constants';

export interface BookingCartItem {
  serviceVariantId: string;
  name: string;
  durationMin: number;
  priceCents: number | null;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function BookingScreen() {
  const {
    businessId,
    serviceVariantId,
    businessName: paramBusinessName,
    serviceName: paramServiceName,
    durationMin: paramDurationMin,
    priceCents: paramPriceCents,
    existingServices: paramExistingServices,
  } = useLocalSearchParams<{
    businessId: string;
    serviceVariantId: string;
    businessName?: string;
    serviceName?: string;
    durationMin?: string;
    priceCents?: string;
    existingServices?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState<BookingCartItem[]>([]);
  const hasInitializedCart = useRef(false);

  const {
    business,
    serviceVariant,
    slots,
    availableDates,
    selectedDate,
    setSelectedDate,
    loadingSlots,
  } = useBookingData(businessId, serviceVariantId);

  const displayName = business?.name ?? paramBusinessName ?? 'Salon';

  const initialSingleItem = useMemo((): BookingCartItem | null => {
    if (paramServiceName && serviceVariantId) {
      return {
        serviceVariantId,
        name: paramServiceName,
        durationMin: paramDurationMin ? parseInt(paramDurationMin, 10) : 0,
        priceCents: paramPriceCents ? parseInt(paramPriceCents, 10) : null,
      };
    }
    if (serviceVariant) {
      return {
        serviceVariantId: serviceVariant.id,
        name: serviceVariant.name,
        durationMin: serviceVariant.durationMin,
        priceCents: serviceVariant.priceCents,
      };
    }
    return null;
  }, [serviceVariantId, paramServiceName, paramDurationMin, paramPriceCents, serviceVariant]);

  useEffect(() => {
    try {
      if (typeof paramExistingServices === 'string' && paramExistingServices) {
        const parsed = JSON.parse(paramExistingServices) as BookingCartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedServices(parsed);
          hasInitializedCart.current = true;
          return;
        }
      }
    } catch {
      // ignore
    }
    if (initialSingleItem && !hasInitializedCart.current) {
      setSelectedServices([initialSingleItem]);
      hasInitializedCart.current = true;
    }
  }, [paramExistingServices, initialSingleItem?.serviceVariantId]);

  const totalPriceCents = selectedServices.reduce((sum, s) => sum + (s.priceCents ?? 0), 0);

  const availableVariantsToAdd = useMemo(() => {
    if (!business?.services) return [];
    const selectedIds = new Set(selectedServices.map((s) => s.serviceVariantId));
    const list: Array<BookingCartItem & { serviceName: string }> = [];
    for (const svc of business.services) {
      for (const v of svc.serviceVariants ?? []) {
        if (selectedIds.has(v.id)) continue;
        list.push({
          serviceVariantId: v.id,
          name: v.name,
          durationMin: v.durationMin,
          priceCents: v.priceCents,
          serviceName: svc.name,
        });
      }
    }
    return list;
  }, [business?.services, selectedServices]);
  const displaySlots = showMoreSlots ? slots : slots.slice(0, 6);
  const hasMoreSlots = slots.length > 6;
  const { width } = useWindowDimensions();
  const slotWidth = (width - spacing.lg * 2 - spacing.md * 2) / 3;

  async function handleConfirmDate() {
    if (!selectedSlot || !businessId || selectedServices.length === 0) {
      Alert.alert('Error', 'Please select a time slot and at least one service');
      return;
    }
    if (!user) {
      router.push({
        pathname: '/(tabs)/booking/identification',
        params: {
          selectedSlot,
          existingServices: JSON.stringify(selectedServices),
          businessId,
          businessName: displayName,
        },
      });
      return;
    }
    const locationId = business?.locations?.[0]?.id;
    if (!locationId) {
      Alert.alert('Error', 'Unable to complete booking. Please try again.');
      return;
    }
    setBooking(true);
    try {
      const payload = {
        businessId,
        locationId,
        items: selectedServices.map((s) => ({ serviceVariantId: s.serviceVariantId, quantity: 1 })),
        startAt: selectedSlot,
        idempotencyKey: generateIdempotencyKey(),
      };
      await api.post('/appointments', payload);
      Alert.alert('Success', 'Appointment booked!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/bookings') },
      ]);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err && typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response: { data: { message: string } } }).response.data.message
          : 'Something went wrong. Please try again or choose another slot.';
      Alert.alert('Booking failed', message);
    } finally {
      setBooking(false);
    }
  }

  function handleRemoveService(index: number) {
    setSelectedServices((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) router.back();
      return next;
    });
  }

  function handleAddService(item: BookingCartItem) {
    setSelectedServices((prev) => [...prev, item]);
    setAddServiceModalVisible(false);
  }

  const today = new Date();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 120 }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {displayName.toUpperCase()}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressStep}>Step 2 of 4</Text>
          <Text style={styles.progressTitle}>Date & Time selection</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Selected services */}
        {selectedServices.length > 0 && (
          <View style={styles.serviceSection}>
            {selectedServices.map((item, index) => (
              <View
                key={`${item.serviceVariantId}-${index}`}
                style={[styles.serviceCard, index > 0 && styles.serviceCardNotFirst]}
              >
                <View style={styles.serviceCardContent}>
                  <View style={styles.serviceCardLeft}>
                    <Text style={styles.serviceCardName}>{item.name}</Text>
                    <View style={styles.serviceCardMeta}>
                      <Text style={styles.serviceCardMetaText}>{item.durationMin} min</Text>
                      <Text style={styles.serviceCardDot}> • </Text>
                      <Text style={styles.serviceCardPrice}>
                        {item.priceCents != null
                          ? `${(item.priceCents / 100).toFixed(0)}€`
                          : '—'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveService(index)}
                    >
                      <Ionicons name="close" size={16} color={colors.light.textSecondary} />
                      <Text style={styles.removeButtonText}>REMOVE</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.serviceCardImageWrap}>
                    <Image
                      source={{ uri: DEFAULT_SALON_IMAGES[index % DEFAULT_SALON_IMAGES.length] }}
                      style={styles.serviceCardImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addServiceButton}
                onPress={() => {
                if (business?.services && availableVariantsToAdd.length > 0) {
                  setAddServiceModalVisible(true);
                } else if (businessId) {
                  router.push({
                    pathname: '/(tabs)/business/[id]',
                    params: {
                      id: businessId,
                      addToBooking: '1',
                      existingServices: JSON.stringify(selectedServices),
                    },
                  });
                }
              }}
            >
              <Ionicons name="add" size={20} color={colors.light.textSecondary} />
              <Text style={styles.addServiceButtonText}>ADD ANOTHER SERVICE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Select Date */}
        <View style={styles.dateSection}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>SELECT DATE</Text>
            <Text style={styles.sectionMonth}>
              {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateChipsContent}
          >
            {availableDates.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dateChipDay, isSelected && styles.dateChipDaySelected]}>
                    {getDatePickerDayLabel(date, today)}
                  </Text>
                  <Text style={[styles.dateChipNum, isSelected && styles.dateChipNumSelected]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Available Time */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>AVAILABLE TIME</Text>
          {loadingSlots ? (
            <View style={styles.slotsLoading}>
              <ActivityIndicator size="small" color={colors.light.text} />
            </View>
          ) : slots.length === 0 ? (
            <Text style={styles.slotsEmpty}>No slots available for this date</Text>
          ) : (
            <>
              <View style={styles.slotsGrid}>
                {displaySlots.map((slot, index) => {
                  const date = new Date(slot.startAt);
                  const timeStr = date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const isSelected = selectedSlot === slot.startAt;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.slotChip,
                        { width: slotWidth },
                        isSelected && styles.slotChipSelected,
                      ]}
                      onPress={() => setSelectedSlot(slot.startAt)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.slotChipText,
                          isSelected && styles.slotChipTextSelected,
                        ]}
                      >
                        {timeStr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {hasMoreSlots && (
                <TouchableOpacity
                  style={styles.seeMoreSlots}
                  onPress={() => setShowMoreSlots((v) => !v)}
                >
                  <Text style={styles.seeMoreSlotsText}>
                    {showMoreSlots ? 'SEE FEWER SLOTS' : 'SEE MORE SLOTS'}
                  </Text>
                  <Ionicons
                    name={showMoreSlots ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.light.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>TOTAL PRICE</Text>
          <Text style={styles.totalValue}>
            {(totalPriceCents / 100).toFixed(2).replace('.', ',')} €
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedSlot || selectedServices.length === 0 || booking) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmDate}
          disabled={!selectedSlot || selectedServices.length === 0 || booking}
        >
          {booking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmButtonText}>CONFIRM DATE</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={addServiceModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddServiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setAddServiceModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setAddServiceModalVisible(false)}
              style={styles.modalClose}
            >
              <Ionicons name="close" size={24} color={colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add another service</Text>
            <FlatList
              data={availableVariantsToAdd}
              keyExtractor={(item) => item.serviceVariantId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleAddService(item)}
                  activeOpacity={0.7}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  headerSpacer: {
    width: 40,
  },
  progressSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.light.surface,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  progressStep: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  progressBarBg: {
    height: 2,
    backgroundColor: colors.light.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.light.text,
    borderRadius: 1,
  },
  scroll: {
    flex: 1,
  },
  serviceSection: {
    padding: spacing.lg,
  },
  serviceCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    overflow: 'hidden',
    padding: spacing.md,
  },
  serviceCardNotFirst: {
    marginTop: spacing.md,
  },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  serviceCardLeft: {
    flex: 1,
  },
  serviceCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  serviceCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceCardMetaText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  serviceCardDot: {
    fontSize: 14,
    color: colors.light.textTertiary,
  },
  serviceCardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing['xl'],
  },
  removeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
  },
  serviceCardImageWrap: {
    width: 96,
    height: 96,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.light.surfaceSecondary,
    marginLeft: spacing.md,
  },
  serviceCardImage: {
    width: '100%',
    height: '100%',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignSelf: 'center',
  },
  addServiceButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
  },
  dateSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.text,
  },
  sectionMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
  dateChipsContent: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: spacing.sm,
  },
  dateChip: {
    minWidth: 64,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateChipSelected: {
    backgroundColor: colors.light.text,
    borderColor: colors.light.text,
  },
  dateChipDay: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  dateChipDaySelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  dateChipNum: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.text,
  },
  dateChipNumSelected: {
    color: '#FFF',
  },
  timeSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  slotChip: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotChipSelected: {
    backgroundColor: colors.light.text,
    borderColor: colors.light.text,
  },
  slotChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  slotChipTextSelected: {
    color: '#FFF',
  },
  slotsLoading: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  slotsEmpty: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  seeMoreSlots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
    paddingVertical: 12,
  },
  seeMoreSlotsText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.light.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  totalBlock: {
    flexDirection: 'column',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
  },
  confirmButton: {
    minWidth: 180,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
  },
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
  modalItemText: {
    flex: 1,
  },
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
