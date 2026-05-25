import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from '../../common/decorators';
import { UserRole } from './entities/user.entity';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('receptionist')
  @Roles('admin')
  @ApiOperation({ summary: 'Crear cuenta de recepcionista (Admin)' })
  createReceptionist(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createReceptionist(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todos los usuarios (Admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar perfil propio' })
  updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Editar usuario (Admin)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/deactivate')
  @Roles('admin')
  @ApiOperation({ summary: 'Desactivar usuario (Admin)' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivateUser(id);
  }
}
