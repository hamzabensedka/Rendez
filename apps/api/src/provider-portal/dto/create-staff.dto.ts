import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
