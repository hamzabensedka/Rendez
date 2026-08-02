import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  ScanSimulationJobData,
  SCAN_SIMULATION_JOB_NAME,
} from '../jobs/scan-simulation.job';

@Processor('scan-simulation')
export class ScanSimulationProcessor extends WorkerHost {
  private readonly logger = new Logger(ScanSimulationProcessor.name);

  async process(job: Job<ScanSimulationJobData, void, string>): Promise<void> {
    const { businessId, userId, scanType, parameters } = job.data;

    this.logger.log(
      `Processing scan simulation job ${job.id} - type: ${scanType}, business: ${businessId || 'all'}, user: ${userId || 'all'}`,
    );

    try {
      // Simulate scan operation with variable duration
      const duration = scanType === 'full' ? 500 : 200;
      await new Promise((resolve) => setTimeout(resolve, duration));

      // Simulate scan results
      const results = {
        scanned: Math.floor(Math.random() * 100) + 1,
        matched: Math.floor(Math.random() * 20),
        scanType,
        parameters: parameters || {},
      };

      this.logger.log(
        `Scan simulation job ${job.id} completed with results: ${JSON.stringify(results)}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process scan simulation job ${job.id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
