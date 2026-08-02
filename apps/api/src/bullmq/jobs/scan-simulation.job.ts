export interface ScanSimulationJobData {
  businessId: string;
  scanType: 'full' | 'incremental' | 'validation';
  parameters?: Record<string, unknown>;
}
