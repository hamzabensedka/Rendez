import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  async getStaff() {
    return this.staffService.getStaff();
  }

  @Get(':id')
  async getStaffMember(@Param('id') id: number) {
    return this.staffService.getStaffMember(id);
  }

  @Post()
  async createStaffMember(@Body() staff: any) {
    return this.staffService.createStaffMember(staff);
  }
}
