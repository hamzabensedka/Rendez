import { ApiProperty } from '@nestjs/swagger';

export class StaffDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;
}
