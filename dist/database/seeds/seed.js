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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../modules/users/entities/user.entity");
const room_entity_1 = require("../../modules/rooms/entities/room.entity");
const reservation_entity_1 = require("../../modules/reservations/entities/reservation.entity");
const payment_entity_1 = require("../../modules/payments/entities/payment.entity");
dotenv.config();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hotel_monaco',
    entities: [user_entity_1.User, room_entity_1.Room, reservation_entity_1.Reservation, payment_entity_1.Payment],
    synchronize: false,
    ssl: false,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('✅ Conectado a la base de datos');
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const roomRepo = AppDataSource.getRepository(room_entity_1.Room);
    const reservationRepo = AppDataSource.getRepository(reservation_entity_1.Reservation);
    const paymentRepo = AppDataSource.getRepository(payment_entity_1.Payment);
    await paymentRepo.query('DELETE FROM payments');
    await reservationRepo.query('DELETE FROM reservations');
    await roomRepo.query('DELETE FROM rooms');
    await userRepo.query('DELETE FROM users');
    console.log('🗑️  Datos anteriores eliminados');
    const SALT_ROUNDS = 12;
    const adminHash = await bcrypt.hash('Admin1234!', SALT_ROUNDS);
    const recepHash = await bcrypt.hash('Recep1234!', SALT_ROUNDS);
    const clientHash = await bcrypt.hash('Client1234!', SALT_ROUNDS);
    const admin = userRepo.create({
        firstName: 'Carlos',
        lastName: 'Martínez',
        email: 'admin@hotelmonaco.com',
        passwordHash: adminHash,
        documentNumber: '1000000001',
        phone: '+57 300 100 0001',
        role: user_entity_1.UserRole.ADMIN,
        isActive: true,
    });
    const receptionist = userRepo.create({
        firstName: 'María',
        lastName: 'García',
        email: 'recepcion@hotelmonaco.com',
        passwordHash: recepHash,
        documentNumber: '1000000002',
        phone: '+57 300 100 0002',
        role: user_entity_1.UserRole.RECEPTIONIST,
        isActive: true,
    });
    const client1 = userRepo.create({
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@correo.com',
        passwordHash: clientHash,
        documentNumber: '1000000003',
        phone: '+57 300 100 0003',
        role: user_entity_1.UserRole.CLIENT,
        isActive: true,
    });
    const client2 = userRepo.create({
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@correo.com',
        passwordHash: clientHash,
        documentNumber: '1000000004',
        phone: '+57 300 100 0004',
        role: user_entity_1.UserRole.CLIENT,
        isActive: true,
    });
    const client3 = userRepo.create({
        firstName: 'Pedro',
        lastName: 'Rodríguez',
        email: 'pedro@correo.com',
        passwordHash: clientHash,
        documentNumber: '1000000005',
        phone: '+57 300 100 0005',
        role: user_entity_1.UserRole.CLIENT,
        isActive: true,
    });
    const [savedAdmin, savedReceptionist, savedClient1, savedClient2, savedClient3] = await userRepo.save([admin, receptionist, client1, client2, client3]);
    console.log('👥 Usuarios creados');
    const rooms = roomRepo.create([
        {
            roomNumber: '101',
            type: room_entity_1.RoomType.INDIVIDUAL,
            pricePerNight: 80,
            beds: 1,
            description: 'Habitación individual cómoda con vista al jardín.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '102',
            type: room_entity_1.RoomType.INDIVIDUAL,
            pricePerNight: 85,
            beds: 1,
            description: 'Habitación individual con vista a la ciudad.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Caja fuerte'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '201',
            type: room_entity_1.RoomType.DOUBLE,
            pricePerNight: 130,
            beds: 2,
            description: 'Habitación doble amplia ideal para parejas o viajeros de negocios.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Minibar'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '202',
            type: room_entity_1.RoomType.DOUBLE,
            pricePerNight: 140,
            beds: 2,
            description: 'Habitación doble con balcón y vista panorámica.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Minibar', 'Balcón'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '301',
            type: room_entity_1.RoomType.SUITE,
            pricePerNight: 220,
            beds: 1,
            description: 'Suite junior con sala de estar independiente y bañera de hidromasaje.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Bañera hidromasaje', 'Sala de estar', 'Minibar', 'Caja fuerte'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '302',
            type: room_entity_1.RoomType.SUITE,
            pricePerNight: 280,
            beds: 2,
            description: 'Suite presidencial con comedor privado y terraza exclusiva.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Bañera hidromasaje', 'Comedor privado', 'Terraza', 'Servicio a la habitación 24h'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '401',
            type: room_entity_1.RoomType.FAMILY,
            pricePerNight: 190,
            beds: 3,
            description: 'Habitación familiar con espacio para 4 personas, zona de juegos para niños.',
            services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Zona infantil', 'Nevera'],
            images: [],
            status: room_entity_1.RoomStatus.AVAILABLE,
        },
        {
            roomNumber: '402',
            type: room_entity_1.RoomType.FAMILY,
            pricePerNight: 200,
            beds: 4,
            description: 'Gran habitación familiar con dos cuartos conectados.',
            services: ['WiFi', 'TV', 'Aire acondicionado', '2 Baños', 'Sala de estar', 'Zona infantil'],
            images: [],
            status: room_entity_1.RoomStatus.CLEANING,
        },
    ]);
    const savedRooms = await roomRepo.save(rooms);
    console.log('🛏️  Habitaciones creadas');
    const today = new Date();
    const fmt = (d) => d.toISOString().split('T')[0];
    const pastCheckIn = new Date(today);
    pastCheckIn.setDate(today.getDate() - 10);
    const pastCheckOut = new Date(today);
    pastCheckOut.setDate(today.getDate() - 7);
    const activeCheckIn = new Date(today);
    activeCheckIn.setDate(today.getDate() - 1);
    const activeCheckOut = new Date(today);
    activeCheckOut.setDate(today.getDate() + 2);
    const futureCheckIn = new Date(today);
    futureCheckIn.setDate(today.getDate() + 2);
    const futureCheckOut = new Date(today);
    futureCheckOut.setDate(today.getDate() + 5);
    const res1 = reservationRepo.create({
        userId: savedClient1.id,
        roomId: savedRooms[0].id,
        checkInDate: fmt(pastCheckIn),
        checkOutDate: fmt(pastCheckOut),
        totalNights: 3,
        totalPrice: 240,
        status: reservation_entity_1.ReservationStatus.COMPLETED,
        cancellationReason: null,
        cancelledBy: null,
    });
    const res2 = reservationRepo.create({
        userId: savedClient2.id,
        roomId: savedRooms[2].id,
        checkInDate: fmt(activeCheckIn),
        checkOutDate: fmt(activeCheckOut),
        totalNights: 3,
        totalPrice: 390,
        status: reservation_entity_1.ReservationStatus.IN_STAY,
        cancellationReason: null,
        cancelledBy: null,
    });
    const res3 = reservationRepo.create({
        userId: savedClient3.id,
        roomId: savedRooms[4].id,
        checkInDate: fmt(futureCheckIn),
        checkOutDate: fmt(futureCheckOut),
        totalNights: 3,
        totalPrice: 660,
        status: reservation_entity_1.ReservationStatus.CONFIRMED,
        cancellationReason: null,
        cancelledBy: null,
    });
    const [savedRes1, savedRes2, savedRes3] = await reservationRepo.save([res1, res2, res3]);
    await roomRepo.update(savedRooms[2].id, { status: room_entity_1.RoomStatus.OCCUPIED });
    await roomRepo.update(savedRooms[4].id, { status: room_entity_1.RoomStatus.RESERVED });
    console.log('📅 Reservas creadas');
    const payments = paymentRepo.create([
        {
            reservationId: savedRes1.id,
            userId: savedClient1.id,
            amount: 240,
            method: payment_entity_1.PaymentMethod.CREDIT_CARD,
            status: payment_entity_1.PaymentStatus.COMPLETED,
        },
        {
            reservationId: savedRes2.id,
            userId: savedClient2.id,
            amount: 390,
            method: payment_entity_1.PaymentMethod.DEBIT_CARD,
            status: payment_entity_1.PaymentStatus.COMPLETED,
        },
        {
            reservationId: savedRes3.id,
            userId: savedClient3.id,
            amount: 660,
            method: payment_entity_1.PaymentMethod.TRANSFER,
            status: payment_entity_1.PaymentStatus.COMPLETED,
        },
    ]);
    await paymentRepo.save(payments);
    console.log('💳 Pagos creados');
    await AppDataSource.destroy();
    console.log('\n🎉 Seed completado exitosamente');
    console.log('─────────────────────────────────────────');
    console.log('👤 Admin:         admin@hotelmonaco.com   / Admin1234!');
    console.log('👤 Recepcionista: recepcion@hotelmonaco.com / Recep1234!');
    console.log('👤 Clientes:      juan@correo.com | ana@correo.com | pedro@correo.com / Client1234!');
    console.log('🛏️  Habitaciones: 8 creadas (101-102, 201-202, 301-302, 401-402)');
    console.log('📅 Reservas:      3 de muestra (completada, en estadía, confirmada)');
    console.log('─────────────────────────────────────────');
}
seed().catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map