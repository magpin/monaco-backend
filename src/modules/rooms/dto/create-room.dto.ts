import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Número de habitación único' })
  @IsString({ message: 'El número de habitación debe ser texto' })
  @IsNotEmpty({ message: 'El número de habitación es requerido' })
  roomNumber: string;

  @ApiProperty({ enum: RoomType, description: 'Tipo de habitación' })
  @IsEnum(RoomType, { message: 'El tipo debe ser individual, double, suite o family' })
  type: RoomType;

  @ApiProperty({ example: 150.0, description: 'Precio por noche en USD' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  pricePerNight: number;

  @ApiProperty({ example: 2, description: 'Cantidad de camas' })
  @IsInt({ message: 'La cantidad de camas debe ser un número entero' })
  @Min(1, { message: 'La habitación debe tener al menos 1 cama' })
  beds: number;

  @ApiPropertyOptional({ example: ['WiFi', 'TV', 'Aire acondicionado'] })
  @IsOptional()
  @IsArray({ message: 'Los servicios deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada servicio debe ser texto' })
  services?: string[];

  @ApiPropertyOptional({ example: 'Habitación con vista al mar' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  description?: string;

  @ApiPropertyOptional({ example: ['https://example.com/room1.jpg'] })
  @IsOptional()
  @IsArray({ message: 'Las imágenes deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada imagen debe ser una URL' })
  images?: string[];
}
