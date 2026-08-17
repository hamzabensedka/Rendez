import { ApiProperty } from '@nestjs/swagger';

export class StaffDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}