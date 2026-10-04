// @refresh reset
import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFloatingBarOffset } from '../../../application/components/BottomNav';
import { useBookingData } from '../hooks/useBookingData';
import type { Slot } from '../hooks/useBookingData';
import { useBookingCart } from '../hooks/useBookingCart';
import { useBookingSubmit } from '../hooks/useBookingSubmit';
import {
  BookingHeader,
  BookingServiceList,
  BookingDatePicker,
  BookingSlotsGrid,
  BookingFooter,
  AddServiceModal,
  StaffChips,
} from '../components';

import type { BookingCartItem } from '../types';

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
  const footerBottomOffset = useFloatingBarOffset();

  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);

  const preview = useBookingData(businessId, serviceVariantId, selectedStaffId, [], {
    slots: false,
  });

  const displayName = preview.business?.name ?? paramBusinessName ?? 'Salon';

  const initialSingleItem = useMemo((): BookingCartItem | null => {
    if (paramServiceName && serviceVariantId) {
      return {
        serviceVariantId,
        name: paramServiceName,
        durationMin: paramDurationMin ? parseInt(paramDurationMin, 10) : 0,
        priceCents: paramPriceCents ? parseInt(paramPriceCents, 10) : null,
      };
    }
    if (preview.serviceVariant) {
      return {
        serviceVariantId: preview.serviceVariant.id,
        name: preview.serviceVariant.name,
        durationMin: preview.serviceVariant.durationMin,
        priceCents: preview.serviceVariant.priceCents,
      };
    }
    return null;
  }, [serviceVariantId, paramServiceName, paramDurationMin, paramPriceCents, preview.serviceVariant]);

  const cart = useBookingCart(
    {
      paramExistingServices,
      initialSingleItem,
      business: preview.business,
    },
    () => router.back()
  );

  const {
    business,
    staff,
    slots,
    availableDates,
    selectedDate,
    setSelectedDate,
    loadingSlots,
    slotsError,
    loadAvailability,
  } = useBookingData(
    businessId,
    serviceVariantId,
    selectedStaffId,
    cart.selectedServices.map((s) => s.serviceVariantId)
  );

  const submit = useBookingSubmit({
    businessId,
    business,
    selectedServices: cart.selectedServices,
    displayName,
  });

  function handleSelectStaff(id: string | null) {
    setSelectedStaffId(id);
    setSelectedSlot(null);
  }

  function handleSelectDate(d: Date) {
    setSelectedDate(d);
    setSelectedSlot(null);
  }

  function handleAddAnotherPress() {
    if (business?.services && cart.availableVariantsToAdd.length > 0) {
      setAddServiceModalVisible(true);
    } else if (businessId) {
      router.push({
        pathname: '/(main)/business/[id]',
        params: {
          id: businessId,
          addToBooking: '1',
          existingServices: JSON.stringify(cart.selectedServices),
        },
      });
    }
  }

  function handleAddService(item: BookingCartItem) {
    cart.handleAddService(item);
    setSelectedSlot(null);
    setAddServiceModalVisible(false);
  }

  function handleRemoveService(index: number) {
    cart.handleRemoveService(index);
    setSelectedSlot(null);
  }

  return (
    <View style={[styles.container, { paddingBottom: footerBottomOffset }]}>
      <BookingHeader title="Your visit" paddingTop={insets.top} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BookingServiceList
          items={cart.selectedServices}
          onRemove={handleRemoveService}
          onAddAnother={handleAddAnotherPress}
        />
        <StaffChips
          staff={staff}
          selectedStaffId={selectedStaffId}
          onSelect={handleSelectStaff}
        />
        <BookingDatePicker
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
        <BookingSlotsGrid
          slots={slots}
          selectedSlot={selectedSlot?.startAt ?? null}
          onSelectSlot={(startAt) => {
            const match = slots.find((s) => s.startAt === startAt) ?? { startAt, staffId: selectedStaffId };
            setSelectedSlot(match);
          }}
          loading={loadingSlots}
          slotsError={slotsError}
          onRetry={loadAvailability}
        />
      </ScrollView>

      <BookingFooter
        totalPriceCents={cart.totalPriceCents}
        onConfirm={() => submit.handleConfirmDate(selectedSlot)}
        disabled={!selectedSlot || cart.selectedServices.length === 0}
        loading={submit.booking}
      />

      <AddServiceModal
        visible={addServiceModalVisible}
        onClose={() => setAddServiceModalVisible(false)}
        items={cart.availableVariantsToAdd}
        onSelect={handleAddService}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.colors.paper,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
});
