import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullMQModule } from './bullmq/bullmq.module';

@Module({
  imports: [BullMQModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}