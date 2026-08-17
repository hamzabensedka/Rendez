import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BullmqModule } from '../bullmq/bullmq.module';

@Module({
  imports: [PrismaModule, BullmqModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}