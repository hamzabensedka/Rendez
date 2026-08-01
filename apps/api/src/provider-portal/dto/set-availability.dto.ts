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

class AvailabilityRuleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  start: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  end: string;

  @IsInt()
  @Min(5)
  slotLength: number;
}

export class SetAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRuleDto)
  rules: AvailabilityRuleDto[];
}
