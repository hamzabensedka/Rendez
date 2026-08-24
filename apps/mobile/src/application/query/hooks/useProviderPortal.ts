import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/lib/api';
import { queryKeys } from '../queryKeys';

const BASE = '/provider-portal/businesses';

export interface ProviderAppointment {
  id: string;
  status: string;
  startAtUtc: string;
  endAtUtc: string;
  clientUser?: { id: string; name: string } | null;
  staff?: { id: string; name: string } | null;
  appointmentItems?: { id: string; serviceVariant?: { id: string; name: string } | null }[];
}

export interface AvailabilityRule {
  id?: string;
  dayOfWeek: number;
  startTimeLocal: string;
  endTimeLocal: string;
  staffId?: string | null;
}

export interface TimeOff {
  id: string;
  staffId: string | null;
  startAtUtc: string;
  endAtUtc: string;
  reason: string | null;
}

export interface StaffMember {
  id: string;
  name: string;
  roleTitle: string | null;
  isActive: boolean;
}

function page<T>(response: { data: { data: T[] } }): T[] {
  return response.data.data ?? [];
}

// ── Appointments ───────────────────────────────────────────────────────

export function useProviderAppointments(businessId: string | undefined, status?: string) {
  return useQuery({
    queryKey: queryKeys.providerPortal.appointments(businessId, status),
    queryFn: async (): Promise<ProviderAppointment[]> => {
      const params = status && status !== 'all' ? `?status=${status}` : '';
      const response = await api.get(`${BASE}/${businessId}/appointments${params}`);
      return page<ProviderAppointment>(response);
    },
    enabled: Boolean(businessId),
  });
}

export function useTransitionAppointment(businessId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { appointmentId: string; status: string; reason?: string }) => {
      await api.patch(`/provider-portal/appointments/${input.appointmentId}/status`, {
        status: input.status,
        reason: input.reason,
      });
    },
    onSuccess: () => {
      if (businessId) {
        void queryClient.invalidateQueries({
          queryKey: ['providerPortal', 'appointments', businessId],
        });
      }
    },
  });
}

// ── Availability rules ─────────────────────────────────────────────────

export function useAvailabilityRules(businessId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.providerPortal.availabilityRules(businessId),
    queryFn: async (): Promise<AvailabilityRule[]> => {
      const response = await api.get(`${BASE}/${businessId}/availability-rules`);
      return response.data ?? [];
    },
    enabled: Boolean(businessId),
  });
}

export function useReplaceAvailabilityRules(businessId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rules: AvailabilityRule[]) => {
      const payload = rules.map((rule) => ({
        dayOfWeek: rule.dayOfWeek,
        startTimeLocal: rule.startTimeLocal,
        endTimeLocal: rule.endTimeLocal,
      }));
      await api.put(`${BASE}/${businessId}/availability-rules`, { rules: payload });
    },
    onSuccess: () => {
      if (businessId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.providerPortal.availabilityRules(businessId),
        });
      }
    },
  });
}

// ── Time off ───────────────────────────────────────────────────────────

export function useTimeOffs(businessId: string | undefined, upcomingOnly = true) {
  return useQuery({
    queryKey: [...queryKeys.providerPortal.timeOffs(businessId), upcomingOnly],
    queryFn: async (): Promise<TimeOff[]> => {
      const response = await api.get(`${BASE}/${businessId}/time-off?upcomingOnly=${upcomingOnly}`);
      return response.data ?? [];
    },
    enabled: Boolean(businessId),
  });
}

export function useCreateTimeOff(businessId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: {
      staffId?: string;
      startAtUtc: string;
      endAtUtc: string;
      reason?: string;
    }) => {
      await api.post(`${BASE}/${businessId}/time-off`, dto);
    },
    onSuccess: () => {
      if (businessId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.providerPortal.timeOffs(businessId),
        });
      }
    },
  });
}

export function useDeleteTimeOff(businessId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (timeOffId: string) => {
      await api.delete(`${BASE}/${businessId}/time-off/${timeOffId}`);
    },
    onSuccess: () => {
      if (businessId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.providerPortal.timeOffs(businessId),
        });
      }
    },
  });
}

// ── Staff ──────────────────────────────────────────────────────────────

export function useStaffList(businessId: string | undefined, includeInactive = true) {
  return useQuery({
    queryKey: [...queryKeys.providerPortal.staff(businessId), includeInactive],
    queryFn: async (): Promise<StaffMember[]> => {
      const response = await api.get(
        `${BASE}/${businessId}/staff?includeInactive=${includeInactive}`
      );
      return response.data ?? [];
    },
    enabled: Boolean(businessId),
  });
}

export function useCreateStaff(businessId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { name: string; roleTitle?: string }) => {
      await api.post(`${BASE}/${businessId}/staff`, dto);
    },
    onSuccess: () => {
      if (businessId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.providerPortal.staff(businessId),
        });
      }
    },
  });
}

export function useUpdateStaff(businessId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { staffId: string; name?: string; isActive?: boolean }) => {
      await api.patch(`${BASE}/${businessId}/staff/${input.staffId}`, {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      });
    },
    onSuccess: () => {
      if (businessId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.providerPortal.staff(businessId),
        });
      }
    },
  });
}
