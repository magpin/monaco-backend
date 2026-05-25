import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserData, UserResponse } from './types/user-response.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, documentNumber, password, role, ...rest } = createUserDto;

    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) throw new ConflictException('El correo electrónico ya está registrado');

    const docExists = await this.userRepository.findOne({ where: { documentNumber } });
    if (docExists) throw new ConflictException('El número de documento ya está registrado');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      ...rest,
      email,
      documentNumber,
      passwordHash,
      role: role ?? UserRole.CLIENT,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id, isActive: true } });
  }

  async updateFailedAttempts(userId: string, attempts: number, lockedUntil: Date | null): Promise<void> {
    await this.userRepository.update(userId, { failedLoginAttempts: attempts, lockedUntil });
  }

  async createReceptionist(createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.create({ ...createUserDto, role: UserRole.RECEPTIONIST });
    return { status: 201, message: 'Recepcionista creado exitosamente', data: this.mapToUserData(user) };
  }

  async findAll(): Promise<UserResponse> {
    const users = await this.userRepository.find({ order: { createdAt: 'DESC' } });
    return {
      status: 200,
      message: 'Usuarios obtenidos exitosamente',
      data: users.map((u) => this.mapToUserData(u)),
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    return { status: 200, message: 'Usuario actualizado exitosamente', data: this.mapToUserData(saved) };
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    return { status: 200, message: 'Perfil actualizado exitosamente', data: this.mapToUserData(saved) };
  }

  async deactivateUser(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userRepository.update(id, { isActive: false });
    return { status: 200, message: 'Usuario desactivado exitosamente' };
  }

  mapToUserData(user: User): UserData {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      documentNumber: user.documentNumber,
      phone: user.phone ?? null,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
