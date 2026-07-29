import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AvailabilityCacheJob {
  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {}

  async execute(data: any) {
    // Process availability cache job logic here
    console.log('Availability cache job executed successfully');
  }
}
