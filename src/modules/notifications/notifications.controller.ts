import { Controller, Get, Param, Patch, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

interface AuthenticatedRequest {
  user: { id: string; email: string; role: string };
}

@ApiTags('Notificaciones')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones del usuario autenticado' })
  findAll(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Obtener contador de notificaciones no leídas' })
  getUnreadCount(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
