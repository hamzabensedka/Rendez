export interface ScanSimulationJobData {
  businessId?: string;
  userId?: string;
  scanType: 'full' | 'incremental';
  parameters?: Record<string, unknown>;
}

export const SCAN_SIMULATION_JOB_NAME = 'run-scan-simulation';
