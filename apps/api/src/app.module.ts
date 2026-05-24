import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessesModule } from './businesses/businesses.module';
import { ServicesModule } from './services/services.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PlacesModule } from './places/places.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true, colorize: true },
              }
            : undefined,
        genReqId: (req: IncomingMessage & { requestId?: string }) => {
          const id = randomUUID();
          req.requestId = id;
          return id;
        },
        customProps: (req: IncomingMessage & { requestId?: string }) => ({
          requestId: req.requestId,
        }),
        serializers: {
          req: (req: IncomingMessage & { id?: string }) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res: ServerResponse) => ({ statusCode: res.statusCode }),
        },
      },
    }),
    RedisModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AppConfigModule,
    AuthModule,
    UsersModule,
    BusinessesModule,
    ServicesModule,
    AvailabilityModule,
    AppointmentsModule,
    FavoritesModule,
    PlacesModule,
    ServiceCategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

