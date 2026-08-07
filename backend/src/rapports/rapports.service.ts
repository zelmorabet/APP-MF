import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { fr } from 'date-fns/locale';

@Injectable()
export class RapportsService {
  constructor(
    private prisma: PrismaService,
    private emails: EmailsService,
  ) {}

  async rapportAssiduiteMensuel(mois: number, annee: number) {
    const debut = startOfMonth(new Date(annee, mois - 1));
    const fin = endOfMonth(debut);

    const enfants = await this.prisma.enfant.findMany({
      where: { actif: true },
      include: {
        presences: {
          where: { date: { gte: debut, lte: fin } },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { nom: 'asc' },
    });

    const lignes = enfants.map((e) => ({
      enfant: `${e.prenom} ${e.nom}`,
      groupeAge: e.groupeAge,
      presents: e.presences.filter((p) => p.statut === 'PRESENT').length,
      absents: e.presences.filter((p) => p.statut === 'ABSENT' || p.statut === 'ABSENT_JUSTIFIE').length,
      feries: e.presences.filter((p) => p.statut === 'CONGE_FERIE').length,
      fermetures: e.presences.filter((p) => p.statut === 'FERMETURE').length,
    }));

    return { mois, annee, periode: format(debut, 'MMMM yyyy', { locale: fr }), lignes };
  }

  async rapportInscriptions() {
    const enfants = await this.prisma.enfant.findMany({
      include: { parents: { include: { parent: true } } },
      orderBy: [{ actif: 'desc' }, { nom: 'asc' }],
    });
    return { total: enfants.length, actifs: enfants.filter((e) => e.actif).length, enfants };
  }

  async rapportFermetures(annee: number) {
    return this.prisma.calendrierEvenement.findMany({
      where: {
        type: { in: ['FERMETURE', 'FERIE'] },
        dateDebut: { gte: new Date(annee, 0, 1), lte: new Date(annee, 11, 31) },
      },
      orderBy: { dateDebut: 'asc' },
    });
  }

  async rapportFacturationAnnuelle(annee: number) {
    const factures = await this.prisma.facture.findMany({
      where: { annee },
      include: { parent: true },
      orderBy: [{ mois: 'asc' }, { parent: { nom: 'asc' } }],
    });

    const totalBrut = factures.reduce((s, f) => s + Number(f.montantBrut), 0);
    const totalSubvention = factures.reduce((s, f) => s + Number(f.montantSubvention), 0);
    const totalNet = factures.reduce((s, f) => s + Number(f.montantNet), 0);

    return { annee, factures, resume: { totalBrut, totalSubvention, totalNet } };
  }

  async envoyerRapportBC(mois: number, annee: number, emailBC: string) {
    const rapport = await this.rapportAssiduiteMensuel(mois, annee);

    const lignesHtml = rapport.lignes
      .map((l) => `<tr><td>${l.enfant}</td><td>${l.presents}</td><td>${l.absents}</td><td>${l.feries + l.fermetures}</td></tr>`)
      .join('');

    await this.emails.send({
      to: emailBC,
      subject: `Rapport d'assiduité — ${rapport.periode}`,
      html: `
        <h2>Rapport d'assiduité — ${rapport.periode}</h2>
        <table border="1" cellpadding="5" style="border-collapse:collapse">
          <thead><tr><th>Enfant</th><th>Présents</th><th>Absents</th><th>Fermés/Fériés</th></tr></thead>
          <tbody>${lignesHtml}</tbody>
        </table>
      `,
    });

    await this.prisma.rapport.create({
      data: { type: 'ASSIDUITÉ_MENSUELLE', mois, annee, dateEnvoi: new Date() },
    });

    return { message: `Rapport envoyé au Bureau Coordinateur` };
  }
}
