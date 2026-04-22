import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoomType {
  INDIVIDUAL = 'individual',
  DOUBLE = 'double',
  SUITE = 'suite',
  FAMILY = 'family',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  OUT_OF_SERVICE = 'out_of_service',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'room_number' })
  roomNumber: string;

  @Column({ type: 'enum', enum: RoomType })
  type: RoomType;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price_per_night' })
  pricePerNight: number;

  @Column({ type: 'int' })
  beds: number;

  @Column({ type: 'text', array: true, default: '{}' })
  services: string[];

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
