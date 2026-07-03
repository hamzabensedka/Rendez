import { IsString, IsArray, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  businessId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  serviceIds: string[];

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsOptional()
  @IsUUID()
  staffId?: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}