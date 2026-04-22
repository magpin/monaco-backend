import { PaymentMethod } from '../../payments/entities/payment.entity';
export declare class CreateReservationDto {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    paymentMethod: PaymentMethod;
    notes?: string;
}
