import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ScanSimulationJobData } from '../jobs/scan-simulation.job';

@Processor('scan-simulation')
export class ScanSimulationProcessor extends WorkerHost {
  private readonly logger = new Logger(ScanSimulationProcessor.name);

  async process(job: Job<ScanSimulationJobData>): Promise<void> {
    const { businessId, scanType, parameters } = job.data;

    this.logger.log(
      `Processing scan simulation for business ${businessId}: ${scanType}`,
    );

    try {
      // Simulate scan processing (e.g., QR code scan, NFC tap)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.logger.log(
        `Scan simulation completed for business ${businessId} with params: ${JSON.stringify(parameters)}`,
      );
    } catch (error) {
      this.logger.error(
        `Scan simulation failed for business ${businessId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
