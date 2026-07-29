import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NotificationJob {
  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  async execute(data: any) {
    // Process notification job logic here
    console.log('Notification job executed successfully');
  }
}
