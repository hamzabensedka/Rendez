import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, MinLength } from 'class-validator';

export class CreateServiceVariantDto {
  @ApiProperty({ example: 'Standard Cut' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  priceCents?: number;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @Min(5)
  durationMin: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bufferBeforeMin?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bufferAfterMin?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;
}

