import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelReservationDto {
  @ApiPropertyOptional({ example: 'El cliente solicitó cancelación' })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser texto' })
  reason?: string;
}
