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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.CancelledBy = exports.ReservationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const room_entity_1 = require("../../rooms/entities/room.entity");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "pending";
    ReservationStatus["CONFIRMED"] = "confirmed";
    ReservationStatus["IN_STAY"] = "in_stay";
    ReservationStatus["COMPLETED"] = "completed";
    ReservationStatus["CANCELLED"] = "cancelled";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
var CancelledBy;
(function (CancelledBy) {
    CancelledBy["CLIENT"] = "client";
    CancelledBy["RECEPTIONIST"] = "receptionist";
})(CancelledBy || (exports.CancelledBy = CancelledBy = {}));
let Reservation = class Reservation {
    id;
    user;
    userId;
    room;
    roomId;
    checkInDate;
    checkOutDate;
    totalNights;
    totalPrice;
    status;
    cancellationReason;
    cancelledBy;
    createdAt;
    updatedAt;
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Reservation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], Reservation.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'room_id' }),
    __metadata("design:type", String)
], Reservation.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'check_in_date' }),
    __metadata("design:type", String)
], Reservation.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'check_out_date' }),
    __metadata("design:type", String)
], Reservation.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'total_nights' }),
    __metadata("design:type", Number)
], Reservation.prototype, "totalNights", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' }),
    __metadata("design:type", Number)
], Reservation.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.CONFIRMED }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'cancellation_reason' }),
    __metadata("design:type", Object)
], Reservation.prototype, "cancellationReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CancelledBy, nullable: true, name: 'cancelled_by' }),
    __metadata("design:type", Object)
], Reservation.prototype, "cancelledBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('reservations')
], Reservation);
//# sourceMappingURL=reservation.entity.js.map