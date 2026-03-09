import { generateIdempotencyKey } from './validation';

/**
 * Shape of the request body for POST /appointments (create).
 * Use buildCreateAppointmentPayload to construct with idempotency key.
 */
export interface CreateAppointmentPayload {
  businessId: string;
  locationId: string;
  items: Array<{ serviceVariantId: string; quantity: number }>;
  startAt: string; // ISO datetime
  idempotencyKey?: string;
}

/**
 * Build payload for creating an appointment.
 * Optionally pass an idempotency key; one is generated if not provided.
 */
export function buildCreateAppointmentPayload(params: {
  businessId: string;
  locationId: string;
  serviceVariantId: string;
  startAt: string; // ISO datetime
  idempotencyKey?: string;
}): CreateAppointmentPayload {
  return {
    businessId: params.businessId,
    locationId: params.locationId,
    items: [{ serviceVariantId: params.serviceVariantId, quantity: 1 }],
    startAt: params.startAt,
    idempotencyKey: params.idempotencyKey ?? generateIdempotencyKey(),
  };
}
