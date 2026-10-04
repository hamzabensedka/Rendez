export const queryKeys = {
  favorites: (userId: string | undefined) => ['favorites', userId] as const,
  serviceCategories: () => ['serviceCategories'] as const,
  businessesSearch: (params: {
    queryKey: string;
    cityKey: string;
    categoriesKey: string;
    nearKey: string;
    availDateKey: string;
  }) =>
    [
      'businesses',
      'search',
      params.queryKey,
      params.cityKey,
      params.categoriesKey,
      params.nearKey,
      params.availDateKey,
    ] as const,
  business: (id: string | undefined) => ['business', id] as const,
  businessReviews: (id: string | undefined) => ['business', id, 'reviews'] as const,
  availability: (
    businessId: string,
    variantKey: string,
    date: string,
    staffId: string | null
  ) => ['availability', businessId, variantKey, date, staffId ?? 'any'] as const,
  appointmentsUpcoming: (userId: string | undefined) =>
    ['appointments', 'upcoming', userId] as const,
  providerPortal: {
    appointments: (
      businessId: string | undefined,
      status?: string,
      from?: string,
      to?: string
    ) =>
      ['providerPortal', 'appointments', businessId, status ?? 'all', from ?? '', to ?? ''] as const,
    availabilityRules: (businessId: string | undefined) =>
      ['providerPortal', 'availabilityRules', businessId] as const,
    timeOffs: (businessId: string | undefined) =>
      ['providerPortal', 'timeOffs', businessId] as const,
    staff: (businessId: string | undefined) => ['providerPortal', 'staff', businessId] as const,
  },
};
