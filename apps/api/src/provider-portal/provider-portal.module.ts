import { Module } from '@nestjs/common';
import { ProviderPortalController } from './provider-portal.controller';
import { ProviderPortalService } from './provider-portal.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderPortalController],
  providers: [ProviderPortalService],
  exports: [ProviderPortalService],
})
export class ProviderPortalModule {}
