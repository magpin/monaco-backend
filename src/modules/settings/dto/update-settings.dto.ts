import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() hotelName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nit?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() timezone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() language?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() currency?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checkInTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() checkOutTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() allowCancellations?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(168) cancellationHoursLimit?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoConfirm?: boolean;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100) taxRate?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100) consumptionTaxRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableCreditCard?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enablePse?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enableCash?: boolean;
}
