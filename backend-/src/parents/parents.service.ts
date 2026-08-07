import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.parent.findMany({
      include: { enfants: { include: { enfant: true } }, _count: { select: { factures: true, ententes: true } } },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: string) {
    const p = await this.prisma.parent.findUnique({
      where: { id },
      include: { enfants: { include: { enfant: true } }, ententes: { orderBy: { createdAt: 'desc' } }, factures: { orderBy: { annee: 'desc' }, take: 24 } },
    });
    if (!p) throw new NotFoundException(`Parent ${id} introuvable`);
    return p;
  }

  create(dto: CreateParentDto) { return this.prisma.parent.create({ data: dto }); }

  async update(id: string, dto: Partial<CreateParentDto>) {
    await this.findOne(id);
    return this.prisma.parent.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.parent.delete({ where: { id } });
  }
}
