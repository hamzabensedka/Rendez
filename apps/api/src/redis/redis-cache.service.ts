import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface MemoryEntry {
  value: string;
  expiresAt: number;
}

function redactRedisUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = '****';
    return u.toString();
  } catch {
    return '(unparseable REDIS_URL)';
  }
}

function formatRedisError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string') return err;
  return String(err);
}

/**
 * Optional Redis-backed cache; falls back to in-process Map when REDIS_URL is unset
 * or Redis is unreachable (avoids infinite reconnect + log spam from ioredis).
 */
@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis | null = null;
  private readonly memory = new Map<string, MemoryEntry>();

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const url = this.config.get<string>('REDIS_URL')?.trim();
    if (!url) {
      this.logger.log(
        'REDIS_URL not set; using in-memory cache (single instance only).'
      );
      return;
    }

    const candidate = new Redis(url, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      lazyConnect: true,
      // Stop the default infinite reconnect loop that floods logs when Redis is down
      retryStrategy: () => null,
    });

    try {
      await candidate.connect();
      await candidate.ping();
      this.client = candidate;
      this.client.on('error', (err: unknown) => {
        this.logger.warn(
          `Redis connection error after connect: ${formatRedisError(err)}`
        );
      });
      this.logger.log(`Redis connected (${redactRedisUrl(url)}).`);
    } catch (err) {
      candidate.disconnect();
      this.client = null;
      this.logger.warn(
        `Redis unavailable at ${redactRedisUrl(url)} — using in-memory cache. (${formatRedisError(err)})`
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
      this.client = null;
    }
  }

  get isRedis(): boolean {
    return this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (this.client) {
      try {
        return await this.client.get(key);
      } catch {
        return null;
      }
    }
    const e = this.memory.get(key);
    if (!e || Date.now() > e.expiresAt) {
      if (e) this.memory.delete(key);
      return null;
    }
    return e.value;
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (this.client) {
      try {
        if (ttlSeconds > 0) {
          await this.client.setex(key, ttlSeconds, value);
        } else {
          await this.client.set(key, value);
        }
      } catch {
        /* ignore */
      }
      return;
    }
    this.memory.set(key, {
      value,
      expiresAt: Date.now() + Math.max(1, ttlSeconds) * 1000,
    });
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  /**
   * Acquire a short-lived distributed lock (SET NX EX). Returns true if acquired.
   */
  async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    if (this.client) {
      try {
        const ok = await this.client.set(key, '1', 'EX', ttlSeconds, 'NX');
        return ok === 'OK';
      } catch {
        return false;
      }
    }
    const now = Date.now();
    const exp = now + ttlSeconds * 1000;
    const e = this.memory.get(key);
    if (e && e.expiresAt > now) {
      return false;
    }
    this.memory.set(key, { value: '1', expiresAt: exp });
    return true;
  }

  /**
   * Spin until lock acquired or maxWaitMs (for Nominatim spacing).
   */
  async acquireLockSpin(
    key: string,
    ttlSeconds: number,
    maxWaitMs: number,
    spinMs = 50
  ): Promise<void> {
    const deadline = Date.now() + maxWaitMs;
    while (Date.now() < deadline) {
      if (await this.acquireLock(key, ttlSeconds)) {
        return;
      }
      await new Promise((r) => setTimeout(r, spinMs));
    }
  }
}
