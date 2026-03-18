import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('config')
@Controller('config')
export class ConfigController {
  constructor(private config: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Public app config (e.g. app URL for sharing)' })
  getConfig() {
    const appUrl = this.config.get<string>('APP_URL') || 'https://rendez.app';
    return { appUrl };
  }
}
