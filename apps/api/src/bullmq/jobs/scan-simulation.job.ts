export interface ScanSimulationJobData {
  businessId: string;
  scanType: 'qr' | 'nfc' | 'barcode';
  parameters?: Record<string, unknown>;
}
