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
exports.CreateReservationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const payment_entity_1 = require("../../payments/entities/payment.entity");
class CreateReservationDto {
    roomId;
    checkInDate;
    checkOutDate;
    paymentMethod;
    notes;
}
exports.CreateReservationDto = CreateReservationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-room-id', description: 'ID de la habitación' }),
    (0, class_validator_1.IsUUID)('4', { message: 'El ID de habitación debe ser un UUID válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El ID de la habitación es requerido' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-20', description: 'Fecha de check-in (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de check-in debe ser válida (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "checkInDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-22', description: 'Fecha de check-out (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha de check-out debe ser válida (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "checkOutDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: payment_entity_1.PaymentMethod, description: 'Método de pago' }),
    (0, class_validator_1.IsEnum)(payment_entity_1.PaymentMethod, { message: 'El método de pago no es válido' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Solicitud especial: cama extra' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "notes", void 0);
//# sourceMappingURL=create-reservation.dto.js.map