import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
    getPayments(page?: string, limit?: string): Promise<{
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
