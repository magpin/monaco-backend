import { Repository, DataSource } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { RoomsService } from '../rooms/rooms.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { ReservationData, ReservationResponse } from './types/reservation-response.type';
import { UserRole } from '../users/entities/user.entity';
export declare class ReservationsService {
    private readonly reservationRepository;
    private readonly paymentRepository;
    private readonly roomsService;
    private readonly notificationsService;
    private readonly dataSource;
    constructor(reservationRepository: Repository<Reservation>, paymentRepository: Repository<Payment>, roomsService: RoomsService, notificationsService: NotificationsService, dataSource: DataSource);
    create(createDto: CreateReservationDto, userId: string): Promise<ReservationResponse>;
    findAll(userId: string, userRole: UserRole, page?: number, limit?: number): Promise<{
        status: number;
        message: string;
        data: {
            items: ReservationData[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string, userRole: UserRole): Promise<ReservationResponse>;
    update(id: string, updateDto: UpdateReservationDto): Promise<ReservationResponse>;
    cancel(id: string, cancelDto: CancelReservationDto, userId: string, userRole: UserRole): Promise<ReservationResponse>;
    checkIn(id: string): Promise<ReservationResponse>;
    checkOut(id: string): Promise<ReservationResponse>;
    private checkAvailability;
    mapToData(reservation: Reservation, roomNumber?: string): ReservationData;
}
