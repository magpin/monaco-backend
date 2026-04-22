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
exports.CreateRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const room_entity_1 = require("../entities/room.entity");
class CreateRoomDto {
    roomNumber;
    type;
    pricePerNight;
    beds;
    services;
    description;
    images;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '101', description: 'Número de habitación único' }),
    (0, class_validator_1.IsString)({ message: 'El número de habitación debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El número de habitación es requerido' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "roomNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: room_entity_1.RoomType, description: 'Tipo de habitación' }),
    (0, class_validator_1.IsEnum)(room_entity_1.RoomType, { message: 'El tipo debe ser individual, double, suite o family' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150.0, description: 'Precio por noche en USD' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El precio debe ser un número' }),
    (0, class_validator_1.IsPositive)({ message: 'El precio debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "pricePerNight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Cantidad de camas' }),
    (0, class_validator_1.IsInt)({ message: 'La cantidad de camas debe ser un número entero' }),
    (0, class_validator_1.Min)(1, { message: 'La habitación debe tener al menos 1 cama' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "beds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['WiFi', 'TV', 'Aire acondicionado'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Los servicios deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada servicio debe ser texto' }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Habitación con vista al mar' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser texto' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['https://example.com/room1.jpg'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Las imágenes deben ser un arreglo' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Cada imagen debe ser una URL' }),
    __metadata("design:type", Array)
], CreateRoomDto.prototype, "images", void 0);
//# sourceMappingURL=create-room.dto.js.map