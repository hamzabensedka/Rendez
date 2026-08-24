import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProviderPortalController } from './provider-portal.controller';
import { ProviderPortalService } from './provider-portal.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderPortalController],
  providers: [ProviderPortalService],
})
export class ProviderPortalModule {}
