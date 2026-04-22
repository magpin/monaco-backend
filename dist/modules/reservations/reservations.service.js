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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const date_fns_1 = require("date-fns");
const reservation_entity_1 = require("./entities/reservation.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const rooms_service_1 = require("../rooms/rooms.service");
const notifications_service_1 = require("../notifications/notifications.service");
const room_entity_1 = require("../rooms/entities/room.entity");
const user_entity_1 = require("../users/entities/user.entity");
const MAX_ADVANCE_DAYS = 7;
const REFUND_HOURS_THRESHOLD = 24;
let ReservationsService = class ReservationsService {
    reservationRepository;
    paymentRepository;
    roomsService;
    notificationsService;
    dataSource;
    constructor(reservationRepository, paymentRepository, roomsService, notificationsService, dataSource) {
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.roomsService = roomsService;
        this.notificationsService = notificationsService;
        this.dataSource = dataSource;
    }
    async create(createDto, userId) {
        const today = (0, date_fns_1.startOfDay)(new Date());
        const checkIn = (0, date_fns_1.parseISO)(createDto.checkInDate);
        const checkOut = (0, date_fns_1.parseISO)(createDto.checkOutDate);
        if (checkIn < today) {
            throw new common_1.BadRequestException('La fecha de check-in no puede ser anterior a hoy');
        }
        const daysAhead = (0, date_fns_1.differenceInDays)(checkIn, today);
        if (daysAhead > MAX_ADVANCE_DAYS) {
            throw new common_1.BadRequestException(`No se puede reservar con más de ${MAX_ADVANCE_DAYS} días de anticipación`);
        }
        const totalNights = (0, date_fns_1.differenceInDays)(checkOut, checkIn);
        if (totalNights < 1) {
            throw new common_1.BadRequestException('La fecha de check-out debe ser posterior a la de check-in');
        }
        const room = await this.roomsService.findById(createDto.roomId);
        if (!room)
            throw new common_1.NotFoundException('Habitación no encontrada');
        if (room.status !== room_entity_1.RoomStatus.AVAILABLE) {
            throw new common_1.BadRequestException('La habitación no está disponible para las fechas seleccionadas');
        }
        const conflict = await this.checkAvailability(createDto.roomId, createDto.checkInDate, createDto.checkOutDate);
        if (conflict) {
            throw new common_1.BadRequestException('La habitación ya está reservada para esas fechas');
        }
        const totalPrice = totalNights * +room.pricePerNight;
        return this.dataSource.transaction(async (manager) => {
            const reservation = manager.create(reservation_entity_1.Reservation, {
                userId,
                roomId: createDto.roomId,
                checkInDate: createDto.checkInDate,
                checkOutDate: createDto.checkOutDate,
                totalNights,
                totalPrice,
                status: reservation_entity_1.ReservationStatus.CONFIRMED,
            });
            const savedReservation = await manager.save(reservation);
            const payment = manager.create(payment_entity_1.Payment, {
                reservationId: savedReservation.id,
                userId,
                amount: totalPrice,
                method: createDto.paymentMethod,
                status: payment_entity_1.PaymentStatus.COMPLETED,
                transactionDate: new Date(),
            });
            await manager.save(payment);
            await manager.update('rooms', { id: createDto.roomId }, { status: room_entity_1.RoomStatus.RESERVED });
            return {
                status: 201,
                message: 'Reserva creada exitosamente',
                data: this.mapToData(savedReservation, room.roomNumber),
            };
        });
    }
    async findAll(userId, userRole, page = 1, limit = 10) {
        const qb = this.reservationRepository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.room', 'room');
        if (userRole === user_entity_1.UserRole.CLIENT) {
            qb.where('r.user_id = :userId', { userId });
        }
        const [items, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('r.created_at', 'DESC')
            .getManyAndCount();
        return {
            status: 200,
            message: 'Reservas obtenidas exitosamente',
            data: {
                items: items.map((r) => this.mapToData(r, r.room?.roomNumber)),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id, userId, userRole) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['room'],
        });
        if (!reservation)
            throw new common_1.NotFoundException('Reserva no encontrada');
        if (userRole === user_entity_1.UserRole.CLIENT && reservation.userId !== userId) {
            throw new common_1.ForbiddenException('No tiene acceso a esta reserva');
        }
        return {
            status: 200,
            message: 'Reserva obtenida exitosamente',
            data: this.mapToData(reservation, reservation.room?.roomNumber),
        };
    }
    async update(id, updateDto) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['room'],
        });
        if (!reservation)
            throw new common_1.NotFoundException('Reserva no encontrada');
        if (reservation.status !== reservation_entity_1.ReservationStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Solo se pueden modificar reservas confirmadas');
        }
        const newRoomId = updateDto.roomId ?? reservation.roomId;
        const newCheckIn = updateDto.checkInDate ?? reservation.checkInDate;
        const newCheckOut = updateDto.checkOutDate ?? reservation.checkOutDate;
        if (updateDto.roomId && updateDto.roomId !== reservation.roomId) {
            const newRoom = await this.roomsService.findById(updateDto.roomId);
            if (!newRoom)
                throw new common_1.NotFoundException('Nueva habitación no encontrada');
            if (newRoom.status !== room_entity_1.RoomStatus.AVAILABLE) {
                throw new common_1.BadRequestException('La nueva habitación no está disponible');
            }
        }
        const nights = (0, date_fns_1.differenceInDays)((0, date_fns_1.parseISO)(newCheckOut), (0, date_fns_1.parseISO)(newCheckIn));
        if (nights < 1)
            throw new common_1.BadRequestException('Las fechas son inválidas');
        return this.dataSource.transaction(async (manager) => {
            if (updateDto.roomId && updateDto.roomId !== reservation.roomId) {
                await manager.update('rooms', { id: reservation.roomId }, { status: room_entity_1.RoomStatus.AVAILABLE });
                await manager.update('rooms', { id: updateDto.roomId }, { status: room_entity_1.RoomStatus.RESERVED });
            }
            await manager.update(reservation_entity_1.Reservation, { id }, {
                roomId: newRoomId,
                checkInDate: newCheckIn,
                checkOutDate: newCheckOut,
                totalNights: nights,
            });
            const updated = await manager.findOne(reservation_entity_1.Reservation, { where: { id } });
            return {
                status: 200,
                message: 'Reserva actualizada exitosamente',
                data: this.mapToData(updated),
            };
        });
    }
    async cancel(id, cancelDto, userId, userRole) {
        const reservation = await this.reservationRepository.findOne({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reserva no encontrada');
        if (reservation.status === reservation_entity_1.ReservationStatus.CANCELLED ||
            reservation.status === reservation_entity_1.ReservationStatus.COMPLETED) {
            throw new common_1.BadRequestException('Esta reserva no puede ser cancelada');
        }
        if (userRole === user_entity_1.UserRole.CLIENT) {
            if (reservation.userId !== userId)
                throw new common_1.ForbiddenException('No tiene acceso');
            if (reservation.status === reservation_entity_1.ReservationStatus.IN_STAY) {
                throw new common_1.BadRequestException('No se puede cancelar una reserva con check-in activo');
            }
        }
        const checkIn = (0, date_fns_1.parseISO)(reservation.checkInDate);
        const hoursUntilCheckIn = (0, date_fns_1.differenceInDays)(checkIn, new Date()) * 24;
        const hasRefund = hoursUntilCheckIn >= REFUND_HOURS_THRESHOLD;
        return this.dataSource.transaction(async (manager) => {
            await manager.update(reservation_entity_1.Reservation, { id }, {
                status: reservation_entity_1.ReservationStatus.CANCELLED,
                cancellationReason: cancelDto.reason ?? null,
                cancelledBy: userRole === user_entity_1.UserRole.CLIENT ? reservation_entity_1.CancelledBy.CLIENT : reservation_entity_1.CancelledBy.RECEPTIONIST,
            });
            await manager.update('rooms', { id: reservation.roomId }, { status: room_entity_1.RoomStatus.AVAILABLE });
            if (hasRefund) {
                await manager.update(payment_entity_1.Payment, { reservationId: id }, { status: payment_entity_1.PaymentStatus.REFUNDED });
            }
            if (userRole === user_entity_1.UserRole.RECEPTIONIST || userRole === user_entity_1.UserRole.ADMIN) {
                await this.notificationsService.createCancellationNotification(reservation.userId, id, cancelDto.reason);
            }
            const message = hasRefund
                ? 'Reserva cancelada exitosamente. Se procesará el reembolso.'
                : 'Reserva cancelada exitosamente. No aplica reembolso.';
            return { status: 200, message };
        });
    }
    async checkIn(id) {
        const reservation = await this.reservationRepository.findOne({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reserva no encontrada');
        if (reservation.status !== reservation_entity_1.ReservationStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Solo se puede hacer check-in de reservas confirmadas');
        }
        await this.dataSource.transaction(async (manager) => {
            await manager.update(reservation_entity_1.Reservation, { id }, { status: reservation_entity_1.ReservationStatus.IN_STAY });
            await manager.update('rooms', { id: reservation.roomId }, { status: room_entity_1.RoomStatus.OCCUPIED });
        });
        return { status: 200, message: 'Check-in realizado exitosamente' };
    }
    async checkOut(id) {
        const reservation = await this.reservationRepository.findOne({ where: { id } });
        if (!reservation)
            throw new common_1.NotFoundException('Reserva no encontrada');
        if (reservation.status !== reservation_entity_1.ReservationStatus.IN_STAY) {
            throw new common_1.BadRequestException('Solo se puede hacer check-out de reservas con check-in activo');
        }
        await this.dataSource.transaction(async (manager) => {
            await manager.update(reservation_entity_1.Reservation, { id }, { status: reservation_entity_1.ReservationStatus.COMPLETED });
            await manager.update('rooms', { id: reservation.roomId }, { status: room_entity_1.RoomStatus.CLEANING });
        });
        return { status: 200, message: 'Check-out realizado exitosamente' };
    }
    async checkAvailability(roomId, checkIn, checkOut) {
        const conflict = await this.reservationRepository
            .createQueryBuilder('r')
            .where('r.room_id = :roomId', { roomId })
            .andWhere('r.status NOT IN (:...cancelled)', {
            cancelled: [reservation_entity_1.ReservationStatus.CANCELLED, reservation_entity_1.ReservationStatus.COMPLETED],
        })
            .andWhere('r.check_in_date < :checkOut', { checkOut })
            .andWhere('r.check_out_date > :checkIn', { checkIn })
            .getOne();
        return !!conflict;
    }
    mapToData(reservation, roomNumber) {
        return {
            id: reservation.id,
            userId: reservation.userId,
            roomId: reservation.roomId,
            roomNumber,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            totalNights: reservation.totalNights,
            totalPrice: +reservation.totalPrice,
            status: reservation.status,
            cancellationReason: reservation.cancellationReason,
            cancelledBy: reservation.cancelledBy,
            createdAt: reservation.createdAt.toISOString(),
            updatedAt: reservation.updatedAt.toISOString(),
        };
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        rooms_service_1.RoomsService,
        notifications_service_1.NotificationsService,
        typeorm_2.DataSource])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map