export interface ScanSimulationJobData {
  businessId: string;
  scanType: 'check-in' | 'qr-validation';
  appointmentId?: string;
  metadata?: Record<string, unknown>;
}
