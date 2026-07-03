import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RedisModule } from '../redis/redis.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [RedisModule, NotificationsModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, PrismaService],
  exports: [AppointmentService],
})
export class AppointmentModule {}