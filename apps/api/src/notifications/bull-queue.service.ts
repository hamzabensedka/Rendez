import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullQueueService {
  constructor(@InjectQueue('notifications') private readonly queue: Queue<any>) {}

  async add(job: any) {
    await this.queue.add(job);
  }
}
