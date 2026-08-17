import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  appointmentId: string;

  @ApiProperty()
  amount: number;
}
