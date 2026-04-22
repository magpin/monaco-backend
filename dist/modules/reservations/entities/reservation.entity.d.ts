import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
export declare enum ReservationStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    IN_STAY = "in_stay",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum CancelledBy {
    CLIENT = "client",
    RECEPTIONIST = "receptionist"
}
export declare class Reservation {
    id: string;
    user: User;
    userId: string;
    room: Room;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalNights: number;
    totalPrice: number;
    status: ReservationStatus;
    cancellationReason: string | null;
    cancelledBy: CancelledBy | null;
    createdAt: Date;
    updatedAt: Date;
}
