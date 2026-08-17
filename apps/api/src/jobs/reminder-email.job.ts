import { Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReminderEmailJob {
  constructor(@InjectQueue('reminder-email') private readonly queue: Queue) {}

  @Processor('reminder-email')
  async handleJob(job: any) {
    // Send reminder email logic here
    console.log('Reminder email job executed');
  }
}