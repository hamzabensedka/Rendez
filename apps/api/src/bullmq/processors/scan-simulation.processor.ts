import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../bullmq.module';
import { ScanSimulationJobData } from '../jobs/scan-simulation.job';

@Processor(QUEUE_NAMES.SCAN_SIMULATION)
export class ScanSimulationProcessor extends WorkerHost {
  private readonly logger = new Logger(ScanSimulationProcessor.name);

  async process(job: Job<ScanSimulationJobData>): Promise<void> {
    this.logger.log(`Processing scan simulation for business ${job.data.businessId}`);

    const { businessId, scanType } = job.data;

    // Simulate scan execution
    await this.simulateScan(businessId, scanType);

    this.logger.log(`Scan simulation completed for business ${businessId}`);
  }

  private async simulateScan(businessId: string, scanType: string): Promise<void> {
    // Simulate scan processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.logger.debug(`Simulated ${scanType} scan for business ${businessId}`);
  }
}
