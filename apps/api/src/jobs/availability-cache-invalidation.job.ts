import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BullMQ } from '@bullmq/bullmq';
import { JobOptions } from '@bullmq/bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AvailabilityCacheInvalidationJob {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly bullMQ: BullMQ
  ) {}

  async handle(job: any, done: (err?: Error | null) => void) {
    const { resourceId } = job.data;
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId }
    });

    if (!resource) {
      done(new Error(`Resource not found: ${resourceId}`));
      return;
    }

    try {
      await this.cache.invalidate(`availability:${resourceId}`);
      done();
    } catch (error) {
      done(error);
    }
  }
}