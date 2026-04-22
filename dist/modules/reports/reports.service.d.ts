import { Repository } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Room } from '../rooms/entities/room.entity';
export declare class ReportsService {
    private readonly reservationRepository;
    private readonly paymentRepository;
    private readonly roomRepository;
    constructor(reservationRepository: Repository<Reservation>, paymentRepository: Repository<Payment>, roomRepository: Repository<Room>);
    getRevenue(from: string, to: string): Promise<{
        status: number;
        message: string;
        data: {
            totalRevenue: number;
            totalPayments: number;
            byDay: {
                date: string;
                revenue: number;
            }[];
        };
    }>;
    getOccupancy(): Promise<{
        status: number;
        message: string;
        data: {
            totalRooms: number;
            occupiedRooms: number;
            occupancyRate: number;
        };
    }>;
    getPayments(page?: number, limit?: number): Promise<{
        status: number;
        message: string;
        data: {
            items: {
                id: string;
                reservationId: string;
                userId: string;
                amount: number;
                method: import("../payments/entities/payment.entity").PaymentMethod;
                status: import("../payments/entities/payment.entity").PaymentStatus;
                transactionDate: string;
                createdAt: string;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
