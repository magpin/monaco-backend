import { NotificationsService } from './notifications.service';
interface AuthenticatedRequest {
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: AuthenticatedRequest): Promise<import("./types/notification-response.type").NotificationResponse>;
    getUnreadCount(req: AuthenticatedRequest): Promise<{
        status: number;
        message: string;
        data: {
            count: number;
        };
    }>;
    markAsRead(id: string, req: AuthenticatedRequest): Promise<import("./types/notification-response.type").NotificationResponse>;
}
export {};
