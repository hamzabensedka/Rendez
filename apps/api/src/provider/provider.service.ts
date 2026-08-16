import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessHoursDto } from './dto/business-hours.dto';
import { StaffDto } from './dto/staff.dto';
import { ServicesDto } from './dto/services.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProvider(): Promise<any> {
    return this.prismaService.provider.findMany();
  }

  async createBusinessHours(businessHoursDto: BusinessHoursDto): Promise<any> {
    return this.prismaService.businessHours.create({ data: businessHoursDto });
  }

  async updateBusinessHours(id: number, businessHoursDto: BusinessHoursDto): Promise<any> {
    return this.prismaService.businessHours.update({ where: { id }, data: businessHoursDto });
  }

  async deleteBusinessHours(id: number): Promise<any> {
    return this.prismaService.businessHours.delete({ where: { id } });
  }

  async createStaff(staffDto: StaffDto): Promise<any> {
    return this.prismaService.staff.create({ data: staffDto });
  }

  async updateStaff(id: number, staffDto: StaffDto): Promise<any> {
    return this.prismaService.staff.update({ where: { id }, data: staffDto });
  }

  async deleteStaff(id: number): Promise<any> {
    return this.prismaService.staff.delete({ where: { id } });
  }

  async createServices(servicesDto: ServicesDto): Promise<any> {
    return this.prismaService.services.create({ data: servicesDto });
  }

  async updateServices(id: number, servicesDto: ServicesDto): Promise<any> {
    return this.prismaService.services.update({ where: { id }, data: servicesDto });
  }

  async deleteServices(id: number): Promise<any> {
    return this.prismaService.services.delete({ where: { id } });
  }
}
