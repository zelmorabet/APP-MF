import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateContactUrgenceDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsUrgenceService {
  constructor(private prisma: PrismaService) {}

  findByEnfant(enfantId: string) {
    return this.prisma.contactUrgence.findUnique({ where: { enfantId } });
  }

  async create(dto: CreateContactUrgenceDto) {
    const existing = await this.prisma.contactUrgence.findUnique({ where: { enfantId: dto.enfantId } });
    if (existing) throw new ConflictException('Cet enfant a déjà un contact d\'urgence');
    return this.prisma.contactUrgence.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateContactUrgenceDto>) {
    if (!await this.prisma.contactUrgence.findUnique({ where: { id } })) throw new NotFoundException();
    return this.prisma.contactUrgence.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    if (!await this.prisma.contactUrgence.findUnique({ where: { id } })) throw new NotFoundException();
    return this.prisma.contactUrgence.delete({ where: { id } });
  }
}
