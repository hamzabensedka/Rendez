import { ApiProperty } from '@nestjs/swagger';

export class BusinessHoursDto {
  @ApiProperty({ example: 'Monday' })
  day: string;

  @ApiProperty({ example: '09:00' })
  startTime: string;

  @ApiProperty({ example: '17:00' })
  endTime: string;
}
