import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationData, NotificationResponse } from './types/notification-response.type';
export declare class NotificationsService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    createCancellationNotification(userId: string, reservationId: string, reason?: string): Promise<void>;
    findByUser(userId: string): Promise<NotificationResponse>;
    markAsRead(id: string, userId: string): Promise<NotificationResponse>;
    getUnreadCount(userId: string): Promise<{
        status: number;
        message: string;
        data: {
            count: number;
        };
    }>;
    mapToData(notification: Notification): NotificationData;
}
