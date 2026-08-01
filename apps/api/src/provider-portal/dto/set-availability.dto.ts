import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  Matches,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';

class AvailabilityRule {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number; // 0 = Sunday, 6 = Saturday

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  start: string; // HH:mm

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  end: string;

  @IsInt()
  @Min(5)
  slotLength: number; // minutes
}

export class SetAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRule)
  rules: AvailabilityRule[];
}
