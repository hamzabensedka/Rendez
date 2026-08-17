import { Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AvailabilityCacheInvalidationJob {
  constructor(@InjectQueue('availability-cache-invalidation') private readonly queue: Queue) {}

  @Processor('availability-cache-invalidation')
  async handleJob(job: any) {
    // Invalidate availability cache logic here
    console.log('Availability cache invalidation job executed');
  }
}