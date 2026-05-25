import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('hotel_settings')
export class HotelSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Información general
  @Column({ type: 'varchar', length: 100, default: 'Hotel Mónaco', name: 'hotel_name' })
  hotelName: string;

  @Column({ type: 'varchar', length: 50, default: '900.123.456-7' })
  nit: string;

  @Column({ type: 'varchar', length: 200, default: 'Calle Principal #123, Ciudad' })
  address: string;

  @Column({ type: 'varchar', length: 30, default: '+57 (1) 234-5678' })
  phone: string;

  @Column({ type: 'varchar', length: 100, default: 'info@hotelmonaco.com' })
  email: string;

  @Column({ type: 'varchar', length: 100, default: 'www.hotelmonaco.com' })
  website: string;

  @Column({ type: 'text', default: 'Hotel de lujo ubicado en el corazón de la ciudad.', nullable: true })
  description: string;

  // Regional
  @Column({ type: 'varchar', length: 50, default: 'america-bogota' })
  timezone: string;

  @Column({ type: 'varchar', length: 5, default: 'es' })
  language: string;

  @Column({ type: 'varchar', length: 10, default: 'cop' })
  currency: string;

  // Horarios
  @Column({ type: 'varchar', length: 10, default: '15:00', name: 'check_in_time' })
  checkInTime: string;

  @Column({ type: 'varchar', length: 10, default: '12:00', name: 'check_out_time' })
  checkOutTime: string;

  // Políticas de reserva
  @Column({ type: 'boolean', default: true, name: 'allow_cancellations' })
  allowCancellations: boolean;

  @Column({ type: 'int', default: 24, name: 'cancellation_hours_limit' })
  cancellationHoursLimit: number;

  @Column({ type: 'boolean', default: true, name: 'auto_confirm' })
  autoConfirm: boolean;

  // Impuestos
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 19, name: 'tax_rate' })
  taxRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 8, name: 'consumption_tax_rate' })
  consumptionTaxRate: number;

  // Métodos de pago
  @Column({ type: 'boolean', default: true, name: 'enable_credit_card' })
  enableCreditCard: boolean;

  @Column({ type: 'boolean', default: true, name: 'enable_pse' })
  enablePse: boolean;

  @Column({ type: 'boolean', default: true, name: 'enable_cash' })
  enableCash: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
