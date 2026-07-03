import { IsString, IsNumber, IsOptional } from 'class-validator';

export class RefundPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}
