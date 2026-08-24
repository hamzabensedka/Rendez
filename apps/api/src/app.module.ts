import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { PlacesModule } from './places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServicesModule } from './services/services.module';
import { FavoritesModule } from './favorites/favorites.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { HealthModule } from './health/health.module';
import { ProviderPortalModule } from './provider-portal/provider-portal.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    // Structured JSON logs with per-request correlation ids; pretty in non-production.
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        genReqId: () => globalThis.crypto.randomUUID(),
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.refreshToken',
          ],
          censor: '[REDACTED]',
        },
        ...(process.env.NODE_ENV !== 'production'
          ? {
              transport: {
                target: 'pino-pretty',
                options: { singleLine: true },
              },
            }
          : {}),
      },
    }),
    // Global rate-limit floor: 100 req/min per IP; auth routes override via @Throttle.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    RedisModule,
    UsersModule,
    ConfigModule,
    PlacesModule,
    PrismaModule,
    ReviewsModule,
    ServicesModule,
    FavoritesModule,
    BusinessesModule,
    AppointmentsModule,
    AvailabilityModule,
    ServiceCategoriesModule,
    HealthModule,
    ProviderPortalModule,
    NotificationsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
