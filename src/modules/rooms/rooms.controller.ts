import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { Roles } from '../../common/decorators';
import { UserRole } from '../users/entities/user.entity';

interface AuthenticatedRequest {
  user: { id: string; email: string; role: UserRole };
}

@ApiTags('Habitaciones')
@ApiBearerAuth('JWT-auth')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear habitación (Admin)' })
  @ApiResponse({ status: 201, description: 'Habitación creada exitosamente' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar habitaciones con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Lista de habitaciones' })
  findAll(@Query() query: QueryRoomsDto) {
    return this.roomsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una habitación' })
  @ApiResponse({ status: 200, description: 'Habitación encontrada' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar habitación (Admin)' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar habitación — soft delete (Admin)' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }

  @Patch(':id/status')
  @Roles('admin', 'receptionist')
  @ApiOperation({ summary: 'Cambiar estado de habitación (Admin + Recepcionista)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateRoomStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.roomsService.updateStatus(id, updateStatusDto, req.user.role);
  }
}
