import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'MiPasswordActual123' })
  @IsString({ message: 'La contraseña actual debe ser una cadena de texto' })
  currentPassword: string;

  @ApiProperty({ example: 'NuevaPassword456' })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}
