import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingService } from './billing.service';

/**
 * Global so enforcement hooks (businesses search/detail, appointments create)
 * can inject BillingService without importing the module everywhere.
 */
@Global()
@Module({
  imports: [PrismaModule],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
