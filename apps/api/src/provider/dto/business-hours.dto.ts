import { ApiProperty } from '@nestjs/swagger';

export class BusinessHoursDTO {
  @ApiProperty()
  monday: string;

  @ApiProperty()
  tuesday: string;

  @ApiProperty()
  wednesday: string;

  @ApiProperty()
  thursday: string;

  @ApiProperty()
  friday: string;

  @ApiProperty()
  saturday: string;

  @ApiProperty()
  sunday: string;
}