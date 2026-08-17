import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [PrismaModule, ProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
