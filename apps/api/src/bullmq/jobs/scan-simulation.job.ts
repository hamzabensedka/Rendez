export interface ScanSimulationJobData {
  businessId: string;
  scanType: 'availability_check' | 'conflict_detection' | 'slot_optimization';
}
