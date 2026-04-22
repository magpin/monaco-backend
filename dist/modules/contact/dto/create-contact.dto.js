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
exports.CreateContactDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contact_message_entity_1 = require("../entities/contact-message.entity");
class CreateContactDto {
    type;
    subject;
    message;
}
exports.CreateContactDto = CreateContactDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: contact_message_entity_1.ContactType }),
    (0, class_validator_1.IsEnum)(contact_message_entity_1.ContactType, { message: 'El tipo de consulta no es válido' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Consulta sobre disponibilidad' }),
    (0, class_validator_1.IsString)({ message: 'El asunto debe ser texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El asunto es requerido' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quisiera saber si tienen habitaciones disponibles para...' }),
    (0, class_validator_1.IsString)({ message: 'El mensaje debe ser texto' }),
    (0, class_validator_1.MinLength)(10, { message: 'El mensaje debe tener al menos 10 caracteres' }),
    __metadata("design:type", String)
], CreateContactDto.prototype, "message", void 0);
//# sourceMappingURL=create-contact.dto.js.map