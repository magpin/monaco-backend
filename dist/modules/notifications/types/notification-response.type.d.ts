import { NotificationType } from '../entities/notification.entity';
export type NotificationData = {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    relatedReservationId: string | null;
    createdAt: string;
};
export type NotificationResponse = {
    status: number;
    message: string;
    data?: NotificationData | NotificationData[];
};
