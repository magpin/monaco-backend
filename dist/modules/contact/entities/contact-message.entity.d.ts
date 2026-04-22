import { User } from '../../users/entities/user.entity';
export declare enum ContactType {
    INFO = "info",
    COMPLAINT = "complaint",
    SPECIAL_REQUEST = "special_request"
}
export declare class ContactMessage {
    id: string;
    user: User;
    userId: string;
    type: ContactType;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}
