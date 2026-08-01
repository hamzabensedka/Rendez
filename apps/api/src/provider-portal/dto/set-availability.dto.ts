import {
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilityRuleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number; // 0=Sunday, 6=Saturday

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  start: string; // HH:mm

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  end: string; // HH:mm

  @IsInt()
  @Min(5)
  slotLength: number; // minutes
}

export class SetAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRuleDto)
  rules: AvailabilityRuleDto[];
}
