import { IsString, IsInt, IsPositive, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  duration: number; // minutes

  @IsNumber()
  @Min(0)
  price: number;
}
