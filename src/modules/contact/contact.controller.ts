import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Roles } from '../../common/decorators';

interface AuthenticatedRequest {
  user: { id: string; email: string; role: string };
}

@ApiTags('Contacto')
@ApiBearerAuth('JWT-auth')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Roles('client')
  @ApiOperation({ summary: 'Enviar mensaje de contacto (Cliente)' })
  create(@Body() createDto: CreateContactDto, @Request() req: AuthenticatedRequest) {
    return this.contactService.create(createDto, req.user.id);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar mensajes de contacto (Admin)' })
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.contactService.findAll(+page, +limit);
  }

  @Patch(':id/read')
  @Roles('admin')
  @ApiOperation({ summary: 'Marcar mensaje como leído (Admin)' })
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }
}
