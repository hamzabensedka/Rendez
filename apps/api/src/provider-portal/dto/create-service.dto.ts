import {
  IsString,
  IsInt,
  IsPositive,
  IsOptional,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsInt()
  @Min(5)
  duration: number; // in minutes

  @IsPositive()
  price: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
