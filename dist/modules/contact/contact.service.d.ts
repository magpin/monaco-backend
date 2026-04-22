import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly contactRepository;
    constructor(contactRepository: Repository<ContactMessage>);
    create(createDto: CreateContactDto, userId: string): Promise<{
        status: number;
        message: string;
        data: {
            id: string;
        };
    }>;
    findAll(page?: number, limit?: number): Promise<{
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
