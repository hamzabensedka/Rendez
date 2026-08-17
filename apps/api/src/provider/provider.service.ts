import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessHours } from '../business-hours/entities/business-hours.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBusinessHoursDto } from '../business-hours/dto/create-business-hours.dto';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { CreateServiceDto } from '../services/dto/create-service.dto';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(BusinessHours)
    private readonly businessHoursRepository: Repository<BusinessHours>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createBusinessHours(createBusinessHoursDto: CreateBusinessHoursDto) {
    const businessHours = this.businessHoursRepository.create(createBusinessHoursDto);
    return this.businessHoursRepository.save(businessHours);
  }

  async createStaff(createStaffDto: CreateStaffDto) {
    const staff = this.staffRepository.create(createStaffDto);
    return this.staffRepository.save(staff);
  }

  async createService(createServiceDto: CreateServiceDto) {
    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service);
  }
}
