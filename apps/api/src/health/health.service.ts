import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis/redis-cache.service';

export interface ReadinessReport {
  status: 'ok' | 'degraded';
  checks: Record<string, boolean>;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService
  ) {}

  /** Liveness: the process is up. Never probes dependencies. */
  liveness(): { status: 'ok' } {
    return { status: 'ok' };
  }

  /**
   * Readiness: dependency probes. `status` is `degraded` when the database is
   * unreachable (the controller maps that to HTTP 503). The cache is optional —
   * it has an in-memory fallback — so it never degrades the overall status.
   */
  async readiness(): Promise<ReadinessReport> {
    const [dbOk, cacheOk] = await Promise.all([this.checkDb(), this.checkCache()]);
    return {
      status: dbOk ? 'ok' : 'degraded',
      checks: { database: dbOk, cache: cacheOk },
    };
  }

  private async checkDb(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkCache(): Promise<boolean> {
    try {
      return await this.redis.ping();
    } catch {
      return false;
    }
  }
}
