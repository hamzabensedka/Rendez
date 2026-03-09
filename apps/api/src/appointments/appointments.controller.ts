import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create appointment' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAppointmentDto
  ) {
    return this.appointmentsService.create(user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my appointments' })
  @ApiQuery({ name: 'upcoming', required: false, type: Boolean })
  async getMyAppointments(
    @CurrentUser() user: AuthenticatedUser,
    @Query('upcoming') upcoming?: string
  ) {
    return this.appointmentsService.findUserAppointments(
      user.id,
      upcoming !== 'false'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    return this.appointmentsService.findOne(id, user);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  async cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CancelAppointmentDto
  ) {
    return this.appointmentsService.cancel(id, user, dto.reason);
  }
}

