import { IsUUID, IsOptional, IsString, IsIn } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID()
  appointmentId: string;

  @IsOptional()
  @IsString()
  @IsIn(['eur', 'usd', 'gbp'])
  currency?: string = 'eur';
}
