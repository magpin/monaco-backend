import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ContactModule } from './modules/contact/contact.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RoomsModule,
    ReservationsModule,
    PaymentsModule,
    NotificationsModule,
    ReportsModule,
    ContactModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
