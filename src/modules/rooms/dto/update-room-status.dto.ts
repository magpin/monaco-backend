import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoomStatus } from '../entities/room.entity';

export class UpdateRoomStatusDto {
  @ApiProperty({ enum: RoomStatus, description: 'Nuevo estado de la habitación' })
  @IsEnum(RoomStatus, { message: 'El estado no es válido' })
  status: RoomStatus;
}
