import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEvenementDto } from './dto/create-evenement.dto';

// Jours fériés Québec 2024-2025
const FERIES_QUEBEC = [
  { titre: "Jour de l'An", date: '2025-01-01' },
  { titre: 'Vendredi saint', date: '2025-04-18' },
  { titre: 'Fête des Patriotes', date: '2025-05-19' },
  { titre: 'Fête nationale du Québec', date: '2025-06-24' },
  { titre: 'Fête du Canada', date: '2025-07-01' },
  { titre: 'Fête du Travail', date: '2025-09-01' },
  { titre: "Action de Grâce", date: '2025-10-13' },
  { titre: 'Noël', date: '2025-12-25' },
];

@Injectable()
export class CalendrierService {
  constructor(private prisma: PrismaService) {}

  findAll(debut?: Date, fin?: Date) {
    return this.prisma.calendrierEvenement.findMany({
      where: debut && fin ? { dateDebut: { gte: debut, lte: fin } } : {},
      orderBy: { dateDebut: 'asc' },
    });
  }

  create(dto: CreateEvenementDto) {
    return this.prisma.calendrierEvenement.create({
      data: {
        ...dto,
        dateDebut: new Date(dto.dateDebut),
        dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
      },
    });
  }

  update(id: string, dto: Partial<CreateEvenementDto>) {
    const data: any = { ...dto };
    if (dto.dateDebut) data.dateDebut = new Date(dto.dateDebut);
    if (dto.dateFin) data.dateFin = new Date(dto.dateFin);
    return this.prisma.calendrierEvenement.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.calendrierEvenement.delete({ where: { id } });
  }

  async importerFeriesQuebec() {
    const ops = FERIES_QUEBEC.map((f) =>
      this.prisma.calendrierEvenement.create({
        data: { titre: f.titre, type: 'FERIE', dateDebut: new Date(f.date), touteJournee: true, couleur: '#ef4444' },
      }),
    );
    return Promise.allSettled(ops);
  }
}
