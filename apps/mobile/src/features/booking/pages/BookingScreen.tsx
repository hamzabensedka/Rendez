import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors } from '@planity/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingData } from '../hooks/useBookingData';
import { useBookingCart } from '../hooks/useBookingCart';
import { useBookingSubmit } from '../hooks/useBookingSubmit';
import {
  BookingHeader,
  BookingProgressBar,
  BookingServiceList,
  BookingDatePicker,
  BookingSlotsGrid,
  BookingFooter,
  AddServiceModal,
} from '../components';
import type { BookingCartItem } from '../types';

/** Step 2 of 4: Date & Time selection. All UI strings in this flow are en-only until i18n is added. */
const BOOKING_STEP_LABEL = 'Step 2 of 4';
const BOOKING_STEP_TITLE = 'Date & Time selection';
const BOOKING_STEP_PERCENT = '50%';

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
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);

  const {
    business,
    serviceVariant,
    slots,
    availableDates,
    selectedDate,
    setSelectedDate,
    loadingSlots,
    slotsError,
    loadAvailability,
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

  const cart = useBookingCart(
    {
      paramExistingServices,
      initialSingleItem,
      business,
    },
    () => router.back()
  );

  const submit = useBookingSubmit({
    businessId,
    business,
    selectedServices: cart.selectedServices,
    displayName,
  });

  function handleAddAnotherPress() {
    if (business?.services && cart.availableVariantsToAdd.length > 0) {
      setAddServiceModalVisible(true);
    } else if (businessId) {
      router.push({
        pathname: '/(tabs)/business/[id]',
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
    setAddServiceModalVisible(false);
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 120 }]}>
      <BookingHeader title={displayName} paddingTop={insets.top} />
      <BookingProgressBar
        stepLabel={BOOKING_STEP_LABEL}
        title={BOOKING_STEP_TITLE}
        progressPercent={BOOKING_STEP_PERCENT}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <BookingServiceList
          items={cart.selectedServices}
          onRemove={cart.handleRemoveService}
          onAddAnother={handleAddAnotherPress}
        />
        <BookingDatePicker
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <BookingSlotsGrid
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
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
        paddingBottom={Math.max(insets.bottom, 24)}
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
    backgroundColor: colors.light.background,
  },
  scroll: { flex: 1 },
});
