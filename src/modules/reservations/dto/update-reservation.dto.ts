import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class UpdateReservationDto {
  @ApiPropertyOptional({ example: 'uuid-room-id' })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de habitación debe ser un UUID válido' })
  roomId?: string;

  @ApiPropertyOptional({ example: '2026-04-20' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de check-in debe ser válida' })
  checkInDate?: string;

  @ApiPropertyOptional({ example: '2026-04-22' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de check-out debe ser válida' })
  checkOutDate?: string;
}
