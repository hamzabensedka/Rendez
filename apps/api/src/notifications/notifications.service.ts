import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaClient } from '@prisma/client';
import { RedisClient } from 'redis';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly prisma: PrismaClient,
    private readonly redisClient: RedisClient,
  ) {}

  async sendReminder(notification: any) {
    // Send reminder logic here
    await this.notificationsQueue.add('send-reminder', notification);
  }
}