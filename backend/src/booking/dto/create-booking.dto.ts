import { IsUUID, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  serviceId: string;

  @IsUUID()
  staffId: string;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  extras?: string[];
}