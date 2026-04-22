"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("../reservations/entities/reservation.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const room_entity_1 = require("../rooms/entities/room.entity");
let ReportsService = class ReportsService {
    reservationRepository;
    paymentRepository;
    roomRepository;
    constructor(reservationRepository, paymentRepository, roomRepository) {
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.roomRepository = roomRepository;
    }
    async getRevenue(from, to) {
        const payments = await this.paymentRepository
            .createQueryBuilder('p')
            .select('SUM(p.amount)', 'total')
            .addSelect('COUNT(p.id)', 'count')
            .where('p.transaction_date BETWEEN :from AND :to', { from, to })
            .andWhere('p.status = :status', { status: 'completed' })
            .getRawOne();
        const byDay = await this.paymentRepository
            .createQueryBuilder('p')
            .select('DATE(p.transaction_date)', 'date')
            .addSelect('SUM(p.amount)', 'revenue')
            .where('p.transaction_date BETWEEN :from AND :to', { from, to })
            .andWhere('p.status = :status', { status: 'completed' })
            .groupBy('DATE(p.transaction_date)')
            .orderBy('date', 'ASC')
            .getRawMany();
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map