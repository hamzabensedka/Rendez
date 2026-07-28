import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ScanSimulationJobData } from '../jobs/scan-simulation.job';

@Processor('scan-simulation')
export class ScanSimulationProcessor extends WorkerHost {
  private readonly logger = new Logger(ScanSimulationProcessor.name);

  async process(job: Job<ScanSimulationJobData>): Promise<void> {
    const { businessId, scanType, appointmentId, metadata } = job.data;

    this.logger.log(
      `Processing scan simulation job ${job.id}: ${scanType} for business ${businessId}`,
    );

    try {
      await job.updateProgress(10);

      switch (scanType) {
        case 'checkin':
          await this.simulateCheckin(businessId, appointmentId, metadata);
          break;
        case 'qr-validation':
          await this.simulateQRValidation(businessId, appointmentId, metadata);
          break;
        default:
          throw new Error(`Unsupported scan type: ${scanType}`);
      }

      await job.updateProgress(100);
      this.logger.log(`Scan simulation job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(
        `Scan simulation job ${job.id} failed: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  private async simulateCheckin(
    businessId: string,
    appointmentId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    this.logger.log(
      `Simulating check-in for business ${businessId}, appointment ${appointmentId || 'N/A'}`,
    );

    // Simulate check-in processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`Check-in simulation completed for business ${businessId}`);
  }

  private async simulateQRValidation(
    businessId: string,
    appointmentId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    this.logger.log(
      `Simulating QR validation for business ${businessId}, appointment ${appointmentId || 'N/A'}`,
    );

    // Simulate QR code validation
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.logger.log(`QR validation simulation completed for business ${businessId}`);
  }
}
