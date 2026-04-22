import { ReservationStatus, CancelledBy } from '../entities/reservation.entity';
export type ReservationData = {
    id: string;
    userId: string;
    roomId: string;
    roomNumber?: string;
    checkInDate: string;
    checkOutDate: string;
    totalNights: number;
    totalPrice: number;
    status: ReservationStatus;
    cancellationReason: string | null;
    cancelledBy: CancelledBy | null;
    createdAt: string;
    updatedAt: string;
};
export type ReservationResponse = {
    status: number;
    message: string;
    data?: ReservationData | ReservationData[];
};
export type ReservationListResponse = {
    status: number;
    message: string;
    data: {
        items: ReservationData[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};
