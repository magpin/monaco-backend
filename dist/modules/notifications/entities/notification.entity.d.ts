import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    CANCELLATION = "cancellation",
    INFO = "info",
    REMINDER = "reminder"
}
export declare class Notification {
    id: string;
    user: User;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    relatedReservationId: string | null;
    createdAt: Date;
}
