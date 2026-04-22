import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationData, NotificationResponse } from './types/notification-response.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createCancellationNotification(
    userId: string,
    reservationId: string,
    reason?: string,
  ): Promise<void> {
    const notification = this.notificationRepository.create({
      userId,
      title: 'Reserva cancelada',
      message: reason
        ? `Su reserva ha sido cancelada por el recepcionista. Motivo: ${reason}`
        : 'Su reserva ha sido cancelada por el recepcionista.',
      type: NotificationType.CANCELLATION,
      relatedReservationId: reservationId,
    });
    await this.notificationRepository.save(notification);
  }

  async findByUser(userId: string): Promise<NotificationResponse> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return {
      status: 200,
      message: 'Notificaciones obtenidas exitosamente',
      data: notifications.map((n) => this.mapToData(n)),
    };
  }

  async markAsRead(id: string, userId: string): Promise<NotificationResponse> {
    await this.notificationRepository.update({ id, userId }, { isRead: true });
    return { status: 200, message: 'Notificación marcada como leída' };
  }

  async getUnreadCount(userId: string): Promise<{ status: number; message: string; data: { count: number } }> {
    const count = await this.notificationRepository.count({
      where: { userId, isRead: false },
    });
    return { status: 200, message: 'Contador obtenido exitosamente', data: { count } };
  }

  mapToData(notification: Notification): NotificationData {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      relatedReservationId: notification.relatedReservationId,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
