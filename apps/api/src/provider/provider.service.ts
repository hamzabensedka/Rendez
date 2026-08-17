import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessHoursDTO } from './dto/business-hours.dto';
import { StaffDTO } from './dto/staff.dto';
import { ServicesDTO } from './dto/services.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async createBusinessHours(businessHoursDTO: BusinessHoursDTO) {
    return this.prismaService.businessHours.create({
      data: businessHoursDTO,
    });
  }

  async getBusinessHours() {
    return this.prismaService.businessHours.findMany();
  }

  async updateBusinessHours(id: number, businessHoursDTO: BusinessHoursDTO) {
    return this.prismaService.businessHours.update({
      where: { id },
      data: businessHoursDTO,
    });
  }

  async deleteBusinessHours(id: number) {
    return this.prismaService.businessHours.delete({ where: { id } });
  }

  async createStaff(staffDTO: StaffDTO) {
    return this.prismaService.staff.create({
      data: staffDTO,
    });
  }

  async getStaff() {
    return this.prismaService.staff.findMany();
  }

  async updateStaff(id: number, staffDTO: StaffDTO) {
    return this.prismaService.staff.update({
      where: { id },
      data: staffDTO,
    });
  }

  async deleteStaff(id: number) {
    return this.prismaService.staff.delete({ where: { id } });
  }

  async createServices(servicesDTO: ServicesDTO) {
    return this.prismaService.services.create({
      data: servicesDTO,
    });
  }

  async getServices() {
    return this.prismaService.services.findMany();
  }

  async updateServices(id: number, servicesDTO: ServicesDTO) {
    return this.prismaService.services.update({
      where: { id },
      data: servicesDTO,
    });
  }

  async deleteServices(id: number) {
    return this.prismaService.services.delete({ where: { id } });
  }
}