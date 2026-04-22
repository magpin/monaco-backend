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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_message_entity_1 = require("./entities/contact-message.entity");
let ContactService = class ContactService {
    contactRepository;
    constructor(contactRepository) {
        this.contactRepository = contactRepository;
    }
    async create(createDto, userId) {
        const message = this.contactRepository.create({ ...createDto, userId });
        const saved = await this.contactRepository.save(message);
        return { status: 201, message: 'Mensaje enviado exitosamente', data: { id: saved.id } };
    }
    async findAll(page = 1, limit = 20) {
        const [items, total] = await this.contactRepository.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            status: 200,
            message: 'Mensajes obtenidos exitosamente',
            data: {
                items: items.map((m) => ({
                    id: m.id,
                    userId: m.userId,
                    type: m.type,
                    subject: m.subject,
                    message: m.message,
                    isRead: m.isRead,
                    createdAt: m.createdAt.toISOString(),
                })),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async markAsRead(id) {
        await this.contactRepository.update(id, { isRead: true });
        return { status: 200, message: 'Mensaje marcado como leído' };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_message_entity_1.ContactMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactService);
//# sourceMappingURL=contact.service.js.map