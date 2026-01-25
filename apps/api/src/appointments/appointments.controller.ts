import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create appointment' })
  async create(@Request() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my appointments' })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean })
  async getMyAppointments(
    @Request() req: any,
    @Query('upcoming') upcoming?: string
  ) {
    return this.appointmentsService.findUserAppointments(
      req.user.id,
      upcoming !== 'false'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details' })
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  async cancel(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CancelAppointmentDto
  ) {
    return this.appointmentsService.cancel(id, req.user.id, dto.reason);
  }
}

