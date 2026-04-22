import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { Roles } from '../../common/decorators';
import { UserRole } from '../users/entities/user.entity';

interface AuthenticatedRequest {
  user: { id: string; email: string; role: UserRole };
}

@ApiTags('Reservas')
@ApiBearerAuth('JWT-auth')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles('client')
  @ApiOperation({ summary: 'Crear reserva + pago (Cliente)' })
  create(@Body() createDto: CreateReservationDto, @Request() req: AuthenticatedRequest) {
    return this.reservationsService.create(createDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar reservas (cliente ve las suyas, recepcionista/admin ve todas)' })
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.reservationsService.findAll(
      req.user.id,
      req.user.role,
      +page,
      +limit,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de reserva' })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.reservationsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles('receptionist', 'admin')
  @ApiOperation({ summary: 'Modificar reserva sin recalcular (Recepcionista)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancelar reserva (Cliente con restricción 24h, Recepcionista sin restricción)' })
  cancel(
    @Param('id') id: string,
    @Body() cancelDto: CancelReservationDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.reservationsService.cancel(id, cancelDto, req.user.id, req.user.role);
  }

  @Post(':id/check-in')
  @Roles('receptionist', 'admin')
  @ApiOperation({ summary: 'Check-in del huésped (Recepcionista)' })
  checkIn(@Param('id') id: string) {
    return this.reservationsService.checkIn(id);
  }

  @Post(':id/check-out')
  @Roles('receptionist', 'admin')
  @ApiOperation({ summary: 'Check-out del huésped (Recepcionista)' })
  checkOut(@Param('id') id: string) {
    return this.reservationsService.checkOut(id);
  }
}
