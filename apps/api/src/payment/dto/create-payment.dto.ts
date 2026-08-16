import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  source: string;

  @ApiProperty()
  description: string;
}