import { IsString, IsOptional, IsNumber } from 'class-validator';

export class RefundPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}