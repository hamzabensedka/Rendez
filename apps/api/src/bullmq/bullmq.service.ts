import { Injectable } from '@nestjs/common';
import { BullMQ } from '@nestjs/bull';

@Injectable()
export class BullMQService {
  constructor(private readonly bullMQ: BullMQ) {}

  async add(queue: string, data: any) {
    return this.bullMQ.add(queue, data);
  }
}
