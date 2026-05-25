import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { Roles } from '../../common/decorators';

@ApiTags('Configuración')
@ApiBearerAuth('JWT-auth')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles('admin', 'receptionist', 'client')
  @ApiOperation({ summary: 'Obtener configuración del hotel' })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar configuración del hotel (Admin)' })
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(dto);
  }
}
