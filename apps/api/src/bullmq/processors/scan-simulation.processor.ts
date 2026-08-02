import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ScanSimulationJobData } from '../jobs/scan-simulation.job';

@Processor('scan-simulation')
export class ScanSimulationProcessor extends WorkerHost {
  private readonly logger = new Logger(ScanSimulationProcessor.name);

  async process(job: Job<ScanSimulationJobData>): Promise<void> {
    const { businessId, scanType, parameters } = job.data;

    this.logger.log(`Processing scan simulation job ${job.id} for business ${businessId} (type: ${scanType})`);

    try {
      // Simulate scan processing
      await this.runScanSimulation(businessId, scanType, parameters);

      this.logger.log(`Scan simulation completed for business ${businessId}`);
    } catch (error) {
      this.logger.error(
        `Scan simulation failed for business ${businessId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private async runScanSimulation(
    businessId: string,
    scanType: string,
    parameters?: Record<string, unknown>,
  ): Promise<void> {
    // Simulate scan processing time
    const processingTime = parameters?.durationMs
      ? (parameters.durationMs as number)
      : 500;

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    this.logger.debug(`Scan simulation completed for business ${businessId} (type: ${scanType})`);
  }
}
