import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.5)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  businessId: string;

  @IsString()
  customerId: string;
}