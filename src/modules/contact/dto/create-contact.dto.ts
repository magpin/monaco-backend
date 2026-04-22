import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ContactType } from '../entities/contact-message.entity';

export class CreateContactDto {
  @ApiProperty({ enum: ContactType })
  @IsEnum(ContactType, { message: 'El tipo de consulta no es válido' })
  type: ContactType;

  @ApiProperty({ example: 'Consulta sobre disponibilidad' })
  @IsString({ message: 'El asunto debe ser texto' })
  @IsNotEmpty({ message: 'El asunto es requerido' })
  subject: string;

  @ApiProperty({ example: 'Quisiera saber si tienen habitaciones disponibles para...' })
  @IsString({ message: 'El mensaje debe ser texto' })
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  message: string;
}
