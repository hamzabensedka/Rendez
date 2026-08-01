import { Module } from '@nestjs/common';
import { ProviderPortalController } from './provider-portal.controller';
import { ProviderPortalService } from './provider-portal.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProviderPortalController],
  providers: [ProviderPortalService],
  exports: [ProviderPortalService],
})
export class ProviderPortalModule {}
