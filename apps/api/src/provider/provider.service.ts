import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBusinessHours(createBusinessHoursDto: CreateBusinessHoursDto) {
    return this.prismaService.businessHours.create({
      data: createBusinessHoursDto,
    });
  }

  async createStaff(createStaffDto: CreateStaffDto) {
    return this.prismaService.staff.create({
      data: createStaffDto,
    });
  }

  async createService(createServiceDto: CreateServiceDto) {
    return this.prismaService.services.create({
      data: createServiceDto,
    });
  }
}
