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
  availability: (businessId: string, serviceVariantId: string, date: string) =>
    ['availability', businessId, serviceVariantId, date] as const,
  appointmentsUpcoming: (userId: string | undefined) => ['appointments', 'upcoming', userId] as const,
};
