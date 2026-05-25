import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Juan', description: 'Nombre del usuario' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  lastName?: string;

  @ApiPropertyOptional({ example: '3001234567', description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  phone?: string;
}
