import { User } from '../../users/entities/user.entity';
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    TRANSFER = "transfer"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    REFUNDED = "refunded"
}
export declare class Payment {
    id: string;
    reservationId: string;
    user: User;
    userId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionDate: Date;
    createdAt: Date;
}
