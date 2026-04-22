import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
interface AuthenticatedRequest {
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createDto: CreateContactDto, req: AuthenticatedRequest): Promise<{
        status: number;
        message: string;
        data: {
            id: string;
        };
    }>;
    findAll(page?: string, limit?: string): Promise<{
        status: number;
        message: string;
        data: {
            items: {
                id: string;
                userId: string;
                type: import("./entities/contact-message.entity").ContactType;
                subject: string;
                message: string;
                isRead: boolean;
                createdAt: string;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    markAsRead(id: string): Promise<{
        status: number;
        message: string;
    }>;
}
export {};
