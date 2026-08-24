import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsUUID,
  IsOptional,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class AppointmentItemDto {
  @ApiProperty()
  @IsUUID()
  serviceVariantId: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  quantity?: number;
}

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  businessId: string;

  @ApiProperty()
  @IsUUID()
  locationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  staffId?: string;

  @ApiProperty({ type: [AppointmentItemDto], maxItems: 20 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => AppointmentItemDto)
  items: AppointmentItemDto[];

  @ApiProperty({ example: '2026-01-19T13:30:00Z' })
  @IsDateString()
  startAt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
