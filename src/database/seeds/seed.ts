import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Room, RoomType, RoomStatus } from '../../modules/rooms/entities/room.entity';
import { Reservation, ReservationStatus } from '../../modules/reservations/entities/reservation.entity';
import { Payment, PaymentMethod, PaymentStatus } from '../../modules/payments/entities/payment.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hotel_monaco',
  entities: [User, Room, Reservation, Payment],
  synchronize: false,
  ssl: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Conectado a la base de datos');

  const userRepo = AppDataSource.getRepository(User);
  const roomRepo = AppDataSource.getRepository(Room);
  const reservationRepo = AppDataSource.getRepository(Reservation);
  const paymentRepo = AppDataSource.getRepository(Payment);

  // Limpiar datos existentes en orden para respetar FK
  await paymentRepo.query('DELETE FROM payments');
  await reservationRepo.query('DELETE FROM reservations');
  await roomRepo.query('DELETE FROM rooms');
  await userRepo.query('DELETE FROM users');
  console.log('🗑️  Datos anteriores eliminados');

  // ─── Usuarios ────────────────────────────────────────────────────────────────
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
    role: UserRole.ADMIN,
    isActive: true,
  });

  const receptionist = userRepo.create({
    firstName: 'María',
    lastName: 'García',
    email: 'recepcion@hotelmonaco.com',
    passwordHash: recepHash,
    documentNumber: '1000000002',
    phone: '+57 300 100 0002',
    role: UserRole.RECEPTIONIST,
    isActive: true,
  });

  const client1 = userRepo.create({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@correo.com',
    passwordHash: clientHash,
    documentNumber: '1000000003',
    phone: '+57 300 100 0003',
    role: UserRole.CLIENT,
    isActive: true,
  });

  const client2 = userRepo.create({
    firstName: 'Ana',
    lastName: 'López',
    email: 'ana@correo.com',
    passwordHash: clientHash,
    documentNumber: '1000000004',
    phone: '+57 300 100 0004',
    role: UserRole.CLIENT,
    isActive: true,
  });

  const client3 = userRepo.create({
    firstName: 'Pedro',
    lastName: 'Rodríguez',
    email: 'pedro@correo.com',
    passwordHash: clientHash,
    documentNumber: '1000000005',
    phone: '+57 300 100 0005',
    role: UserRole.CLIENT,
    isActive: true,
  });

  const [savedAdmin, savedReceptionist, savedClient1, savedClient2, savedClient3] =
    await userRepo.save([admin, receptionist, client1, client2, client3]);
  console.log('👥 Usuarios creados');

  // ─── Habitaciones ─────────────────────────────────────────────────────────────
  const rooms = roomRepo.create([
    {
      roomNumber: '101',
      type: RoomType.INDIVIDUAL,
      pricePerNight: 80,
      beds: 1,
      description: 'Habitación individual cómoda con vista al jardín.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '102',
      type: RoomType.INDIVIDUAL,
      pricePerNight: 85,
      beds: 1,
      description: 'Habitación individual con vista a la ciudad.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Caja fuerte'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '201',
      type: RoomType.DOUBLE,
      pricePerNight: 130,
      beds: 2,
      description: 'Habitación doble amplia ideal para parejas o viajeros de negocios.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Minibar'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '202',
      type: RoomType.DOUBLE,
      pricePerNight: 140,
      beds: 2,
      description: 'Habitación doble con balcón y vista panorámica.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Minibar', 'Balcón'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '301',
      type: RoomType.SUITE,
      pricePerNight: 220,
      beds: 1,
      description: 'Suite junior con sala de estar independiente y bañera de hidromasaje.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Bañera hidromasaje', 'Sala de estar', 'Minibar', 'Caja fuerte'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '302',
      type: RoomType.SUITE,
      pricePerNight: 280,
      beds: 2,
      description: 'Suite presidencial con comedor privado y terraza exclusiva.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Bañera hidromasaje', 'Comedor privado', 'Terraza', 'Servicio a la habitación 24h'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '401',
      type: RoomType.FAMILY,
      pricePerNight: 190,
      beds: 3,
      description: 'Habitación familiar con espacio para 4 personas, zona de juegos para niños.',
      services: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Zona infantil', 'Nevera'],
      images: [],
      status: RoomStatus.AVAILABLE,
    },
    {
      roomNumber: '402',
      type: RoomType.FAMILY,
      pricePerNight: 200,
      beds: 4,
      description: 'Gran habitación familiar con dos cuartos conectados.',
      services: ['WiFi', 'TV', 'Aire acondicionado', '2 Baños', 'Sala de estar', 'Zona infantil'],
      images: [],
      status: RoomStatus.CLEANING,
    },
  ]);

  const savedRooms = await roomRepo.save(rooms);
  console.log('🛏️  Habitaciones creadas');

  // ─── Reservas de muestra ───────────────────────────────────────────────────────
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

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
    status: ReservationStatus.COMPLETED,
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
    status: ReservationStatus.IN_STAY,
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
    status: ReservationStatus.CONFIRMED,
    cancellationReason: null,
    cancelledBy: null,
  });

  const [savedRes1, savedRes2, savedRes3] = await reservationRepo.save([res1, res2, res3]);

  // Actualizar estado de habitaciones ocupadas
  await roomRepo.update(savedRooms[2].id, { status: RoomStatus.OCCUPIED });
  await roomRepo.update(savedRooms[4].id, { status: RoomStatus.RESERVED });
  console.log('📅 Reservas creadas');

  // ─── Pagos ────────────────────────────────────────────────────────────────────
  const payments = paymentRepo.create([
    {
      reservationId: savedRes1.id,
      userId: savedClient1.id,
      amount: 240,
      method: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.COMPLETED,
    },
    {
      reservationId: savedRes2.id,
      userId: savedClient2.id,
      amount: 390,
      method: PaymentMethod.DEBIT_CARD,
      status: PaymentStatus.COMPLETED,
    },
    {
      reservationId: savedRes3.id,
      userId: savedClient3.id,
      amount: 660,
      method: PaymentMethod.TRANSFER,
      status: PaymentStatus.COMPLETED,
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
