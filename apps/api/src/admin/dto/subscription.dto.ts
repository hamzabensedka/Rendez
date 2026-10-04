import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';
import { BillingPlanStatus } from '@prisma/client';

export class UpdateSubscriptionDto {
  @IsEnum(BillingPlanStatus)
  planStatus!: BillingPlanStatus;

  /** ISO datetime; extend/set the current paid period. */
  @IsOptional()
  @IsISO8601()
  currentPeriodEnd?: string;

  /** ISO datetime; set the end of the grace window (used with GRACE). */
  @IsOptional()
  @IsISO8601()
  graceEndsAt?: string;

  /** ISO datetime; set/extend the trial end (used with TRIAL). */
  @IsOptional()
  @IsISO8601()
  trialEndsAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class MarkInvoicePaidDto {
  /** How the salon paid: manual | transfer | cmi | paymee | d17 | cash. */
  @IsOptional()
  @IsString()
  method?: string;

  /** External reference (transfer ref, CMI txn id, ...). */
  @IsOptional()
  @IsString()
  reference?: string;
}

export class CreateInvoiceDto {
  @IsISO8601()
  periodStart!: string;

  @IsISO8601()
  periodEnd!: string;

  @IsInt()
  @Min(0)
  @Max(100_000_000)
  amountCents!: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
