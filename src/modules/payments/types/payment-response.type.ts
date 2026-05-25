import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export type PaymentData = {
  id: string;
  reservationId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionDate: string;
  createdAt: string;
};

export type PaymentResponse = {
  status: number;
  message: string;
  data?: PaymentData | PaymentData[];
};

export type PaymentListResponse = {
  status: number;
  message: string;
  data: {
    items: PaymentData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
