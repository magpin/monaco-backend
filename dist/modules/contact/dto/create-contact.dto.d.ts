import { ContactType } from '../entities/contact-message.entity';
export declare class CreateContactDto {
    type: ContactType;
    subject: string;
    message: string;
}
