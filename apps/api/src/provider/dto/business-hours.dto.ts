import { ApiProperty } from '@nestjs/swagger';

export class BusinessHoursDto {
  @ApiProperty()
  Monday: string;

  @ApiProperty()
  Tuesday: string;

  @ApiProperty()
  Wednesday: string;

  @ApiProperty()
  Thursday: string;

  @ApiProperty()
  Friday: string;

  @ApiProperty()
  Saturday: string;

  @ApiProperty()
  Sunday: string;
}