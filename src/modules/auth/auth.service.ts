import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './types/auth-response.type';
import { UserResponse } from '../users/types/user-response.type';

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_DURATION_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersService.create({
      ...registerDto,
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      status: 201,
      message: 'Cuenta creada exitosamente',
      data: { token, user: this.usersService.mapToUserData(user) },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.isActive) {
      throw new ForbiddenException('La cuenta está desactivada. Contacte al administrador');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(
        `Cuenta bloqueada temporalmente. Intente nuevamente en ${minutesLeft} minuto(s)`,
      );
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      const newAttempts = user.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;

      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      }

      await this.usersService.updateFailedAttempts(user.id, newAttempts, lockedUntil);

      if (lockedUntil) {
        throw new ForbiddenException(
          `Cuenta bloqueada por ${LOCK_DURATION_MINUTES} minutos por múltiples intentos fallidos`,
        );
      }

      const remaining = MAX_FAILED_ATTEMPTS - newAttempts;
      throw new UnauthorizedException(
        `Credenciales incorrectas. ${remaining} intento(s) restante(s)`,
      );
    }

    await this.usersService.updateFailedAttempts(user.id, 0, null);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      status: 200,
      message: 'Inicio de sesión exitoso',
      data: { token, user: this.usersService.mapToUserData(user) },
    };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    return {
      status: 200,
      message: 'Perfil obtenido exitosamente',
      data: this.usersService.mapToUserData(user),
    };
  }
}
