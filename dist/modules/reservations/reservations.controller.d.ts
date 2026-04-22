import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { UserRole } from '../users/entities/user.entity';
interface AuthenticatedRequest {
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createDto: CreateReservationDto, req: AuthenticatedRequest): Promise<import("./types/reservation-response.type").ReservationResponse>;
    findAll(req: AuthenticatedRequest, page?: string, limit?: string): Promise<{
        status: number;
        message: string;
        data: {
            items: import("./types/reservation-response.type").ReservationData[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, req: AuthenticatedRequest): Promise<import("./types/reservation-response.type").ReservationResponse>;
    update(id: string, updateDto: UpdateReservationDto): Promise<import("./types/reservation-response.type").ReservationResponse>;
    cancel(id: string, cancelDto: CancelReservationDto, req: AuthenticatedRequest): Promise<import("./types/reservation-response.type").ReservationResponse>;
    checkIn(id: string): Promise<import("./types/reservation-response.type").ReservationResponse>;
    checkOut(id: string): Promise<import("./types/reservation-response.type").ReservationResponse>;
}
export {};
