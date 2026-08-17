import { ApiProperty } from '@nestjs/swagger';

export class StaffDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}