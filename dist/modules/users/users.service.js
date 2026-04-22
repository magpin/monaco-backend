"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const { email, documentNumber, password, role, ...rest } = createUserDto;
        const emailExists = await this.userRepository.findOne({ where: { email } });
        if (emailExists)
            throw new common_1.ConflictException('El correo electrónico ya está registrado');
        const docExists = await this.userRepository.findOne({ where: { documentNumber } });
        if (docExists)
            throw new common_1.ConflictException('El número de documento ya está registrado');
        const passwordHash = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({
            ...rest,
            email,
            documentNumber,
            passwordHash,
            role: role ?? user_entity_1.UserRole.CLIENT,
        });
        return this.userRepository.save(user);
    }
    async findByEmail(email) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where('user.email = :email', { email })
            .getOne();
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id, isActive: true } });
    }
    async updateFailedAttempts(userId, attempts, lockedUntil) {
        await this.userRepository.update(userId, { failedLoginAttempts: attempts, lockedUntil });
    }
    async createReceptionist(createUserDto) {
        const user = await this.create({ ...createUserDto, role: user_entity_1.UserRole.RECEPTIONIST });
        return { status: 201, message: 'Recepcionista creado exitosamente', data: this.mapToUserData(user) };
    }
    async findAll() {
        const users = await this.userRepository.find({ order: { createdAt: 'DESC' } });
        return {
            status: 200,
            message: 'Usuarios obtenidos exitosamente',
            data: users.map((u) => this.mapToUserData(u)),
        };
    }
    async updateUser(id, updateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        Object.assign(user, updateUserDto);
        const saved = await this.userRepository.save(user);
        return { status: 200, message: 'Usuario actualizado exitosamente', data: this.mapToUserData(saved) };
    }
    async deactivateUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        await this.userRepository.update(id, { isActive: false });
        return { status: 200, message: 'Usuario desactivado exitosamente' };
    }
    mapToUserData(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            documentNumber: user.documentNumber,
            phone: user.phone ?? null,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map