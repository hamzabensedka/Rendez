import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>;
}
