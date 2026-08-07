import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEnfantDto } from './dto/create-enfant.dto';
import { GroupeAge } from '@prisma/client';
import { differenceInMonths } from 'date-fns';

@Injectable()
export class EnfantsService {
  constructor(private prisma: PrismaService) {}

  findAll(actifSeulement = true) {
    return this.prisma.enfant.findMany({
      where: actifSeulement ? { actif: true } : {},
      include: { parents: { include: { parent: true } }, contactUrgence: true },
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: string) {
    const enfant = await this.prisma.enfant.findUnique({
      where: { id },
      include: {
        parents: { include: { parent: true } },
        contactUrgence: true,
        presences: { orderBy: { date: 'desc' }, take: 30 },
        ententes: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!enfant) throw new NotFoundException(`Enfant ${id} introuvable`);
    return enfant;
  }

  async create(dto: CreateEnfantDto) {
    const count = await this.prisma.enfant.count({ where: { actif: true } });
    if (count >= 9) throw new BadRequestException('Maximum 9 enfants actifs atteint');
    const groupeAge = this.calculerGroupeAge(new Date(dto.dateNaissance));
    return this.prisma.enfant.create({ data: { ...dto, dateNaissance: new Date(dto.dateNaissance), groupeAge } });
  }

  async update(id: string, dto: Partial<CreateEnfantDto>) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.dateNaissance) { data.dateNaissance = new Date(dto.dateNaissance); data.groupeAge = this.calculerGroupeAge(data.dateNaissance); }
    return this.prisma.enfant.update({ where: { id }, data });
  }

  async desactiver(id: string) {
    await this.findOne(id);
    return this.prisma.enfant.update({ where: { id }, data: { actif: false, dateDepart: new Date() } });
  }

  async lierParent(enfantId: string, parentId: string, relation: string, estCustodial = true) {
    const existing = await this.prisma.enfantParent.findUnique({ where: { enfantId_parentId: { enfantId, parentId } } });
    if (!existing) {
      const count = await this.prisma.enfantParent.count({ where: { enfantId } });
      if (count >= 2) throw new BadRequestException('Un enfant ne peut avoir que deux parents');
    }
    return this.prisma.enfantParent.upsert({
      where: { enfantId_parentId: { enfantId, parentId } },
      update: { relation, estCustodial },
      create: { enfantId, parentId, relation, estCustodial },
    });
  }

  async delierParent(enfantId: string, parentId: string) {
    return this.prisma.enfantParent.delete({ where: { enfantId_parentId: { enfantId, parentId } } });
  }

  private calculerGroupeAge(ddn: Date): GroupeAge {
    const mois = differenceInMonths(new Date(), ddn);
    if (mois < 18) return GroupeAge.POUPON;
    if (mois < 36) return GroupeAge.BAMBIN;
    if (mois < 72) return GroupeAge.PRESCOLAIRE;
    return GroupeAge.SCOLAIRE;
  }
}
