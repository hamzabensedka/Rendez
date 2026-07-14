import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class SavePaymentMethodDto {
  @IsString()
  userId: string;

  @IsString()
  setupIntentId: string;

  @IsOptional()
  @IsBoolean()
  setAsDefault?: boolean;
}
