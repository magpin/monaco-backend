import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_STAY = 'in_stay',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CancelledBy {
  CLIENT = 'client',
  RECEPTIONIST = 'receptionist',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ type: 'uuid', name: 'room_id' })
  roomId: string;

  @Column({ type: 'date', name: 'check_in_date' })
  checkInDate: string;

  @Column({ type: 'date', name: 'check_out_date' })
  checkOutDate: string;

  @Column({ type: 'int', name: 'total_nights' })
  totalNights: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.CONFIRMED })
  status: ReservationStatus;

  @Column({ type: 'text', nullable: true, name: 'cancellation_reason' })
  cancellationReason: string | null;

  @Column({ type: 'enum', enum: CancelledBy, nullable: true, name: 'cancelled_by' })
  cancelledBy: CancelledBy | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
