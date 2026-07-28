import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  createService(createServiceDto: CreateServiceDto) {
    return this.prismaService.service.create({ data: createServiceDto });
  }

  createStaff(createStaffDto: CreateStaffDto) {
    return this.prismaService.staff.create({ data: createStaffDto });
  }

  getAppointments() {
    return this.prismaService.appointment.findMany();
  }
}
