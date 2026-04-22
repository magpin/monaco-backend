import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../../payments/entities/payment.entity';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-room-id', description: 'ID de la habitación' })
  @IsUUID('4', { message: 'El ID de habitación debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la habitación es requerido' })
  roomId: string;

  @ApiProperty({ example: '2026-04-20', description: 'Fecha de check-in (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'La fecha de check-in debe ser válida (YYYY-MM-DD)' })
  checkInDate: string;

  @ApiProperty({ example: '2026-04-22', description: 'Fecha de check-out (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'La fecha de check-out debe ser válida (YYYY-MM-DD)' })
  checkOutDate: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod, { message: 'El método de pago no es válido' })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'Solicitud especial: cama extra' })
  @IsOptional()
  @IsString()
  notes?: string;
}
