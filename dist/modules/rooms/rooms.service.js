"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("./entities/room.entity");
const user_entity_1 = require("../users/entities/user.entity");
let RoomsService = class RoomsService {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async create(createRoomDto) {
        const existing = await this.roomRepository.findOne({
            where: { roomNumber: createRoomDto.roomNumber },
        });
        if (existing)
            throw new common_1.ConflictException('El número de habitación ya existe');
        const room = this.roomRepository.create({
            ...createRoomDto,
            services: createRoomDto.services ?? [],
            images: createRoomDto.images ?? [],
        });
        const saved = await this.roomRepository.save(room);
        return { status: 201, message: 'Habitación creada exitosamente', data: this.mapToData(saved) };
    }
    async findAll(query) {
        const { type, status, minPrice, maxPrice, page = 1, limit = 10 } = query;
        const qb = this.roomRepository
            .createQueryBuilder('room')
            .where('room.is_active = :active', { active: true });
        if (type)
            qb.andWhere('room.type = :type', { type });
        if (status)
            qb.andWhere('room.status = :status', { status });
        if (minPrice !== undefined)
            qb.andWhere('room.price_per_night >= :minPrice', { minPrice });
        if (maxPrice !== undefined)
            qb.andWhere('room.price_per_night <= :maxPrice', { maxPrice });
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
    async findOne(id) {
        const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
        if (!room)
            throw new common_1.NotFoundException('Habitación no encontrada');
        return { status: 200, message: 'Habitación obtenida exitosamente', data: this.mapToData(room) };
    }
    async update(id, updateRoomDto) {
        const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
        if (!room)
            throw new common_1.NotFoundException('Habitación no encontrada');
        if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.roomNumber) {
            const exists = await this.roomRepository.findOne({
                where: { roomNumber: updateRoomDto.roomNumber },
            });
            if (exists)
                throw new common_1.ConflictException('El número de habitación ya existe');
        }
        Object.assign(room, updateRoomDto);
        const saved = await this.roomRepository.save(room);
        return { status: 200, message: 'Habitación actualizada exitosamente', data: this.mapToData(saved) };
    }
    async remove(id) {
        const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
        if (!room)
            throw new common_1.NotFoundException('Habitación no encontrada');
        await this.roomRepository.update(id, { isActive: false });
        return { status: 200, message: 'Habitación eliminada exitosamente' };
    }
    async updateStatus(id, updateStatusDto, userRole) {
        const room = await this.roomRepository.findOne({ where: { id, isActive: true } });
        if (!room)
            throw new common_1.NotFoundException('Habitación no encontrada');
        const { status } = updateStatusDto;
        if (userRole === user_entity_1.UserRole.RECEPTIONIST) {
            if (room.status !== room_entity_1.RoomStatus.CLEANING || status !== room_entity_1.RoomStatus.AVAILABLE) {
                throw new common_1.ForbiddenException('El recepcionista solo puede cambiar habitaciones de "En limpieza" a "Disponible"');
            }
        }
        await this.roomRepository.update(id, { status });
        const updated = await this.roomRepository.findOne({ where: { id } });
        return {
            status: 200,
            message: 'Estado de habitación actualizado exitosamente',
            data: this.mapToData(updated),
        };
    }
    async findById(id) {
        return this.roomRepository.findOne({ where: { id, isActive: true } });
    }
    async updateRoomStatus(id, status) {
        await this.roomRepository.update(id, { status });
    }
    mapToData(room) {
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
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map