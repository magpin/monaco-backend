import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { differenceInDays, addDays, startOfDay, parseISO } from 'date-fns';
import { Reservation, ReservationStatus, CancelledBy } from './entities/reservation.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationData, ReservationResponse } from './types/reservation-response.type';
import { RoomStatus } from '../rooms/entities/room.entity';
import { UserRole } from '../users/entities/user.entity';

const MAX_ADVANCE_DAYS = 7;
const REFUND_HOURS_THRESHOLD = 24;

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly roomsService: RoomsService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateReservationDto, userId: string): Promise<ReservationResponse> {
    const today = startOfDay(new Date());
    const checkIn = parseISO(createDto.checkInDate);
    const checkOut = parseISO(createDto.checkOutDate);

    if (checkIn < today) {
      throw new BadRequestException('La fecha de check-in no puede ser anterior a hoy');
    }

    const daysAhead = differenceInDays(checkIn, today);
    if (daysAhead > MAX_ADVANCE_DAYS) {
      throw new BadRequestException(
        `No se puede reservar con más de ${MAX_ADVANCE_DAYS} días de anticipación`,
      );
    }

    const totalNights = differenceInDays(checkOut, checkIn);
    if (totalNights < 1) {
      throw new BadRequestException('La fecha de check-out debe ser posterior a la de check-in');
    }

    const room = await this.roomsService.findById(createDto.roomId);
    if (!room) throw new NotFoundException('Habitación no encontrada');
    if (room.status !== RoomStatus.AVAILABLE) {
      throw new BadRequestException('La habitación no está disponible para las fechas seleccionadas');
    }

    const conflict = await this.checkAvailability(createDto.roomId, createDto.checkInDate, createDto.checkOutDate);
    if (conflict) {
      throw new BadRequestException('La habitación ya está reservada para esas fechas');
    }

    const totalPrice = totalNights * +room.pricePerNight;

    return this.dataSource.transaction(async (manager) => {
      const reservation = manager.create(Reservation, {
        userId,
        roomId: createDto.roomId,
        checkInDate: createDto.checkInDate,
        checkOutDate: createDto.checkOutDate,
        totalNights,
        totalPrice,
        status: ReservationStatus.CONFIRMED,
      });
      const savedReservation = await manager.save(reservation);

      const payment = manager.create(Payment, {
        reservationId: savedReservation.id,
        userId,
        amount: totalPrice,
        method: createDto.paymentMethod,
        status: PaymentStatus.COMPLETED,
        transactionDate: new Date(),
      });
      await manager.save(payment);

      await manager.update('rooms', { id: createDto.roomId }, { status: RoomStatus.RESERVED });

      return {
        status: 201,
        message: 'Reserva creada exitosamente',
        data: this.mapToData(savedReservation, room.roomNumber),
      };
    });
  }

  async findAll(userId: string, userRole: UserRole, page = 1, limit = 10) {
    const qb = this.reservationRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.room', 'room');

    if (userRole === UserRole.CLIENT) {
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

  async findOne(id: string, userId: string, userRole: UserRole): Promise<ReservationResponse> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['room'],
    });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');

    if (userRole === UserRole.CLIENT && reservation.userId !== userId) {
      throw new ForbiddenException('No tiene acceso a esta reserva');
    }

    return {
      status: 200,
      message: 'Reserva obtenida exitosamente',
      data: this.mapToData(reservation, reservation.room?.roomNumber),
    };
  }

  async update(id: string, updateDto: UpdateReservationDto): Promise<ReservationResponse> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['room'],
    });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Solo se pueden modificar reservas confirmadas');
    }

    const newRoomId = updateDto.roomId ?? reservation.roomId;
    const newCheckIn = updateDto.checkInDate ?? reservation.checkInDate;
    const newCheckOut = updateDto.checkOutDate ?? reservation.checkOutDate;

    if (updateDto.roomId && updateDto.roomId !== reservation.roomId) {
      const newRoom = await this.roomsService.findById(updateDto.roomId);
      if (!newRoom) throw new NotFoundException('Nueva habitación no encontrada');
      if (newRoom.status !== RoomStatus.AVAILABLE) {
        throw new BadRequestException('La nueva habitación no está disponible');
      }
    }

    const nights = differenceInDays(parseISO(newCheckOut), parseISO(newCheckIn));
    if (nights < 1) throw new BadRequestException('Las fechas son inválidas');

    return this.dataSource.transaction(async (manager) => {
      if (updateDto.roomId && updateDto.roomId !== reservation.roomId) {
        await manager.update('rooms', { id: reservation.roomId }, { status: RoomStatus.AVAILABLE });
        await manager.update('rooms', { id: updateDto.roomId }, { status: RoomStatus.RESERVED });
      }

      await manager.update(Reservation, { id }, {
        roomId: newRoomId,
        checkInDate: newCheckIn,
        checkOutDate: newCheckOut,
        totalNights: nights,
      });

      const updated = await manager.findOne(Reservation, { where: { id } });
      return {
        status: 200,
        message: 'Reserva actualizada exitosamente',
        data: this.mapToData(updated!),
      };
    });
  }

  async cancel(id: string, cancelDto: CancelReservationDto, userId: string, userRole: UserRole): Promise<ReservationResponse> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');

    if (
      reservation.status === ReservationStatus.CANCELLED ||
      reservation.status === ReservationStatus.COMPLETED
    ) {
      throw new BadRequestException('Esta reserva no puede ser cancelada');
    }

    if (userRole === UserRole.CLIENT) {
      if (reservation.userId !== userId) throw new ForbiddenException('No tiene acceso');
      if (reservation.status === ReservationStatus.IN_STAY) {
        throw new BadRequestException('No se puede cancelar una reserva con check-in activo');
      }
    }

    const checkIn = parseISO(reservation.checkInDate);
    const hoursUntilCheckIn = differenceInDays(checkIn, new Date()) * 24;
    const hasRefund = hoursUntilCheckIn >= REFUND_HOURS_THRESHOLD;

    return this.dataSource.transaction(async (manager) => {
      await manager.update(Reservation, { id }, {
        status: ReservationStatus.CANCELLED,
        cancellationReason: cancelDto.reason ?? null,
        cancelledBy: userRole === UserRole.CLIENT ? CancelledBy.CLIENT : CancelledBy.RECEPTIONIST,
      });

      await manager.update('rooms', { id: reservation.roomId }, { status: RoomStatus.AVAILABLE });

      if (hasRefund) {
        await manager.update(Payment, { reservationId: id }, { status: PaymentStatus.REFUNDED });
      }

      if (userRole === UserRole.RECEPTIONIST || userRole === UserRole.ADMIN) {
        await this.notificationsService.createCancellationNotification(
          reservation.userId,
          id,
          cancelDto.reason,
        );
      }

      const message = hasRefund
        ? 'Reserva cancelada exitosamente. Se procesará el reembolso.'
        : 'Reserva cancelada exitosamente. No aplica reembolso.';

      return { status: 200, message };
    });
  }

  async checkIn(id: string): Promise<ReservationResponse> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Solo se puede hacer check-in de reservas confirmadas');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Reservation, { id }, { status: ReservationStatus.IN_STAY });
      await manager.update('rooms', { id: reservation.roomId }, { status: RoomStatus.OCCUPIED });
    });

    return { status: 200, message: 'Check-in realizado exitosamente' };
  }

  async checkOut(id: string): Promise<ReservationResponse> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    if (reservation.status !== ReservationStatus.IN_STAY) {
      throw new BadRequestException('Solo se puede hacer check-out de reservas con check-in activo');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Reservation, { id }, { status: ReservationStatus.COMPLETED });
      await manager.update('rooms', { id: reservation.roomId }, { status: RoomStatus.CLEANING });
    });

    return { status: 200, message: 'Check-out realizado exitosamente' };
  }

  private async checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
    const conflict = await this.reservationRepository
      .createQueryBuilder('r')
      .where('r.room_id = :roomId', { roomId })
      .andWhere('r.status NOT IN (:...cancelled)', {
        cancelled: [ReservationStatus.CANCELLED, ReservationStatus.COMPLETED],
      })
      .andWhere('r.check_in_date < :checkOut', { checkOut })
      .andWhere('r.check_out_date > :checkIn', { checkIn })
      .getOne();

    return !!conflict;
  }

  mapToData(reservation: Reservation, roomNumber?: string): ReservationData {
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
}
