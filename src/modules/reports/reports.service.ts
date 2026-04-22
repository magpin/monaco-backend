import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../reservations/entities/reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async getRevenue(from: string, to: string) {
    const payments = await this.paymentRepository
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .addSelect('COUNT(p.id)', 'count')
      .where('p.transaction_date BETWEEN :from AND :to', { from, to })
      .andWhere('p.status = :status', { status: 'completed' })
      .getRawOne<{ total: string; count: string }>();

    const byDay = await this.paymentRepository
      .createQueryBuilder('p')
      .select('DATE(p.transaction_date)', 'date')
      .addSelect('SUM(p.amount)', 'revenue')
      .where('p.transaction_date BETWEEN :from AND :to', { from, to })
      .andWhere('p.status = :status', { status: 'completed' })
      .groupBy('DATE(p.transaction_date)')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; revenue: string }>();

    return {
      status: 200,
      message: 'Reporte de ingresos obtenido exitosamente',
      data: {
        totalRevenue: +(payments?.total ?? 0),
        totalPayments: +(payments?.count ?? 0),
        byDay: byDay.map((d) => ({ date: d.date, revenue: +d.revenue })),
      },
    };
  }

  async getOccupancy() {
    const totalRooms = await this.roomRepository.count({ where: { isActive: true } });
    const occupiedRooms = await this.roomRepository
      .createQueryBuilder('r')
      .where('r.status IN (:...statuses)', { statuses: ['occupied', 'reserved'] })
      .andWhere('r.is_active = true')
      .getCount();

    const rate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      status: 200,
      message: 'Tasa de ocupación obtenida exitosamente',
      data: { totalRooms, occupiedRooms, occupancyRate: rate },
    };
  }

  async getPayments(page = 1, limit = 20) {
    const [items, total] = await this.paymentRepository.findAndCount({
      relations: ['user'],
      order: { transactionDate: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      status: 200,
      message: 'Pagos obtenidos exitosamente',
      data: {
        items: items.map((p) => ({
          id: p.id,
          reservationId: p.reservationId,
          userId: p.userId,
          amount: +p.amount,
          method: p.method,
          status: p.status,
          transactionDate: p.transactionDate.toISOString(),
          createdAt: p.createdAt.toISOString(),
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
