import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AvailabilityModule } from '../availability/availability.module';
import { ProviderPortalController } from './provider-portal.controller';
import { ProviderPortalService } from './provider-portal.service';

@Module({
  imports: [PrismaModule, AvailabilityModule],
  controllers: [ProviderPortalController],
  providers: [ProviderPortalService],
})
export class ProviderPortalModule {}
