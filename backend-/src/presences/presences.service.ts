import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePresenceDto, BulkPresenceDto } from './dto/create-presence.dto';
import { startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class PresencesService {
  constructor(private prisma: PrismaService) {}

  async findByDate(date: string) {
    const enfants = await this.prisma.enfant.findMany({
      where: { actif: true },
      include: {
        presences: { where: { date: new Date(date) } },
        parents: { include: { parent: true }, take: 1 },
      },
      orderBy: { prenom: 'asc' },
    });
    return enfants;
  }

  async findByMois(mois: number, annee: number) {
    const debut = startOfMonth(new Date(annee, mois - 1));
    const fin = endOfMonth(debut);
    return this.prisma.presence.findMany({
      where: { date: { gte: debut, lte: fin } },
      include: { enfant: true },
      orderBy: [{ date: 'asc' }, { enfant: { nom: 'asc' } }],
    });
  }

  async upsertPresence(dto: CreatePresenceDto) {
    const date = new Date(dto.date);
    return this.prisma.presence.upsert({
      where: { enfantId_date: { enfantId: dto.enfantId, date } },
      update: {
        statut: dto.statut,
        heureArrivee: dto.heureArrivee,
        heureDepart: dto.heureDepart,
        motifAbsence: dto.motifAbsence,
        note: dto.note,
      },
      create: {
        enfantId: dto.enfantId,
        date,
        statut: dto.statut,
        heureArrivee: dto.heureArrivee,
        heureDepart: dto.heureDepart,
        motifAbsence: dto.motifAbsence,
        note: dto.note,
      },
    });
  }

  async saisieGroupee(dto: BulkPresenceDto) {
    const date = new Date(dto.date);
    const operations = dto.presences.map((p) =>
      this.prisma.presence.upsert({
        where: { enfantId_date: { enfantId: p.enfantId, date } },
        update: { statut: p.statut, heureArrivee: p.heureArrivee, heureDepart: p.heureDepart, note: p.note },
        create: { enfantId: p.enfantId, date, statut: p.statut, heureArrivee: p.heureArrivee, heureDepart: p.heureDepart, note: p.note },
      }),
    );
    return this.prisma.$transaction(operations);
  }

  async statsEnfant(enfantId: string, mois: number, annee: number) {
    const debut = startOfMonth(new Date(annee, mois - 1));
    const fin = endOfMonth(debut);
    const presences = await this.prisma.presence.findMany({
      where: { enfantId, date: { gte: debut, lte: fin } },
    });
    const stats = {
      present: 0, absent: 0, absentJustifie: 0, ferie: 0, fermeture: 0,
    };
    presences.forEach((p) => {
      if (p.statut === 'PRESENT') stats.present++;
      else if (p.statut === 'ABSENT') stats.absent++;
      else if (p.statut === 'ABSENT_JUSTIFIE') stats.absentJustifie++;
      else if (p.statut === 'CONGE_FERIE') stats.ferie++;
      else if (p.statut === 'FERMETURE') stats.fermeture++;
    });
    return { mois, annee, ...stats, total: presences.length };
  }
}
