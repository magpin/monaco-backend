import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentData, PaymentListResponse } from './types/payment-response.type';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getMyPayments(userId: string, page = 1, limit = 20): Promise<PaymentListResponse> {
    const [items, total] = await this.paymentRepository.findAndCount({
      where: { userId },
      order: { transactionDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      status: 200,
      message: 'Pagos obtenidos exitosamente',
      data: {
        items: items.map((p) => this.mapToData(p)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private mapToData(payment: Payment): PaymentData {
    return {
      id: payment.id,
      reservationId: payment.reservationId,
      userId: payment.userId,
      amount: +payment.amount,
      method: payment.method,
      status: payment.status,
      transactionDate: payment.transactionDate.toISOString(),
      createdAt: payment.createdAt.toISOString(),
    };
  }
}
