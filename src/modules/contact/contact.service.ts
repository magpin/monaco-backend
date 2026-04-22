import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  async create(createDto: CreateContactDto, userId: string) {
    const message = this.contactRepository.create({ ...createDto, userId });
    const saved = await this.contactRepository.save(message);
    return { status: 201, message: 'Mensaje enviado exitosamente', data: { id: saved.id } };
  }

  async findAll(page = 1, limit = 20) {
    const [items, total] = await this.contactRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      status: 200,
      message: 'Mensajes obtenidos exitosamente',
      data: {
        items: items.map((m) => ({
          id: m.id,
          userId: m.userId,
          type: m.type,
          subject: m.subject,
          message: m.message,
          isRead: m.isRead,
          createdAt: m.createdAt.toISOString(),
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(id: string) {
    await this.contactRepository.update(id, { isRead: true });
    return { status: 200, message: 'Mensaje marcado como leído' };
  }
}
