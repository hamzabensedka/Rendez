import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  IsHexColor,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
