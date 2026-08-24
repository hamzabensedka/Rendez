import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe (process is up)' })
  liveness() {
    return this.healthService.liveness();
  }

  @Get('ready')
  @ApiOperation({
    summary:
      'Readiness probe: 200 when the database is reachable, 503 otherwise. Cache is optional.',
  })
  async readiness(@Res() res: Response) {
    const report = await this.healthService.readiness();
    const statusCode = report.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(report);
  }
}
