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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rooms_service_1 = require("./rooms.service");
const create_room_dto_1 = require("./dto/create-room.dto");
const update_room_dto_1 = require("./dto/update-room.dto");
const query_rooms_dto_1 = require("./dto/query-rooms.dto");
const update_room_status_dto_1 = require("./dto/update-room-status.dto");
const decorators_1 = require("../../common/decorators");
let RoomsController = class RoomsController {
    roomsService;
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    create(createRoomDto) {
        return this.roomsService.create(createRoomDto);
    }
    findAll(query) {
        return this.roomsService.findAll(query);
    }
    findOne(id) {
        return this.roomsService.findOne(id);
    }
    update(id, updateRoomDto) {
        return this.roomsService.update(id, updateRoomDto);
    }
    remove(id) {
        return this.roomsService.remove(id);
    }
    updateStatus(id, updateStatusDto, req) {
        return this.roomsService.updateStatus(id, updateStatusDto, req.user.role);
    }
};
exports.RoomsController = RoomsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear habitación (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Habitación creada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar habitaciones con filtros y paginación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de habitaciones' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_rooms_dto_1.QueryRoomsDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalle de una habitación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Habitación encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Habitación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar habitación (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_dto_1.UpdateRoomDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar habitación — soft delete (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, decorators_1.Roles)('admin', 'receptionist'),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar estado de habitación (Admin + Recepcionista)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_room_status_dto_1.UpdateRoomStatusDto, Object]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "updateStatus", null);
exports.RoomsController = RoomsController = __decorate([
    (0, swagger_1.ApiTags)('Habitaciones'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
//# sourceMappingURL=rooms.controller.js.map