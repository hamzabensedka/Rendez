import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  appointmentId: number;

  @ApiProperty()
  amount: number;
}