import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomsDto } from './dto/query-rooms.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { RoomData, RoomListResponse, RoomResponse } from './types/room-response.type';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<RoomResponse> {
    const existing = await this.roomRepository.findOne({
      where: { roomNumber: createRoomDto.roomNumber },
    });
    if (existing) throw new ConflictException('El número de habitación ya existe');

    const room = this.roomRepository.create({
      ...createRoomDto,
      services: createRoomDto.services ?? [],
      images: createRoomDto.images ?? [],
    });

    const saved = await this.roomRepository.save(room);
    return { status: 201, message: 'Habitación creada exitosamente', data: this.mapToData(saved) };
  }

  async findAll(query: QueryRoomsDto): Promise<RoomListResponse> {
    const { type, status, minPrice, maxPrice, page = 1, limit = 10 } = query;

    const qb = this.roomRepository
      .createQueryBuilder('room')
      .where('room.is_active = :active', { active: true });

    if (type) qb.andWhere('room.type = :type', { type });
    if (status) qb.andWhere('room.status = :status', { status });
    if (minPrice !== undefined) qb.andWhere('room.price_per_night >= :minPrice', { minPrice });
    if (maxPrice !== undefined) qb.andWhere('room.price_per_night <= :maxPrice', { maxPrice });

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('room.room_number', 'ASC')
      .getManyAndCount();

    return {
      status: 200,
      message: 'Habitaciones obtenidas exitosamente',
      data: {
        items: items.map((r) => this.mapToData(r)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<RoomResponse> {
    const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
    if (!room) throw new NotFoundException('Habitación no encontrada');
    return { status: 200, message: 'Habitación obtenida exitosamente', data: this.mapToData(room) };
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<RoomResponse> {
    const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.roomNumber) {
      const exists = await this.roomRepository.findOne({
        where: { roomNumber: updateRoomDto.roomNumber },
      });
      if (exists) throw new ConflictException('El número de habitación ya existe');
    }

    Object.assign(room, updateRoomDto);
    const saved = await this.roomRepository.save(room);
    return { status: 200, message: 'Habitación actualizada exitosamente', data: this.mapToData(saved) };
  }

  async remove(id: string): Promise<RoomResponse> {
    const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    await this.roomRepository.update(id, { isActive: false });
    return { status: 200, message: 'Habitación eliminada exitosamente' };
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateRoomStatusDto,
    userRole: UserRole,
  ): Promise<RoomResponse> {
    const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    const { status } = updateStatusDto;

    if (userRole === UserRole.RECEPTIONIST) {
      if (room.status !== RoomStatus.CLEANING || status !== RoomStatus.AVAILABLE) {
        throw new ForbiddenException(
          'El recepcionista solo puede cambiar habitaciones de "En limpieza" a "Disponible"',
        );
      }
    }

    await this.roomRepository.update(id, { status });
    const updated = await this.roomRepository.findOne({ where: { id } });
    return {
      status: 200,
      message: 'Estado de habitación actualizado exitosamente',
      data: this.mapToData(updated!),
    };
  }

  async findById(id: string): Promise<Room | null> {
    return this.roomRepository.findOne({ where: { id, isActive: true } });
  }

  async updateRoomStatus(id: string, status: RoomStatus): Promise<void> {
    await this.roomRepository.update(id, { status });
  }

  mapToData(room: Room): RoomData {
    return {
      id: room.id,
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: +room.pricePerNight,
      beds: room.beds,
      services: room.services ?? [],
      description: room.description,
      images: room.images ?? [],
      status: room.status,
      isActive: room.isActive,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };
  }
}
