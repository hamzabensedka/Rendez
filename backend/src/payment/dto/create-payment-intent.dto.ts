import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsIn,
  Min,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  appointmentId: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsIn(['eur', 'usd', 'gbp'])
  currency?: string;

  @IsOptional()
  @IsIn(['automatic', 'manual'])
  captureMethod?: 'automatic' | 'manual';

  @IsOptional()
  @IsArray()
  paymentMethodTypes?: string[];

  @IsOptional()
  savePaymentMethod?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tipAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;
}
