import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
import { StatutFacture, TypeContribution } from '@prisma/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Taux de contribution réduite 2024 (Famille Québec)
const TAUX_CONTRIBUTION_REDUITE = 10.35;

@Injectable()
export class FacturationService {
  constructor(
    private prisma: PrismaService,
    private emails: EmailsService,
  ) {}

  findAll(annee?: number) {
    return this.prisma.facture.findMany({
      where: annee ? { annee } : {},
      include: { parent: true, subventions: true },
      orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
    });
  }

  findByParent(parentId: string) {
    return this.prisma.facture.findMany({
      where: { parentId },
      include: { subventions: true },
      orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
    });
  }

  async genererFacturesMois(mois: number, annee: number) {
    const debut = startOfMonth(new Date(annee, mois - 1));
    const fin = endOfMonth(debut);

    // Récupérer tous les parents actifs avec présences du mois
    const parents = await this.prisma.parent.findMany({
      include: {
        enfants: {
          include: {
            enfant: {
              include: {
                presences: {
                  where: { date: { gte: debut, lte: fin }, statut: 'PRESENT' },
                },
              },
            },
          },
        },
      },
    });

    const factures: any[] = [];
    for (const parent of parents) {
      const entente = await this.prisma.ententeService.findFirst({
        where: { parentId: parent.id, statut: 'SIGNEE' },
        orderBy: { createdAt: 'desc' },
      });

      const joursPresents = parent.enfants.reduce((acc, ep) => acc + ep.enfant.presences.length, 0);
      if (joursPresents === 0) continue;

      const tarif = entente ? Number(entente.tarifJournalier) : TAUX_CONTRIBUTION_REDUITE;
      const montantBrut = joursPresents * tarif;
      const subvention = parent.typeContribution === TypeContribution.REDUIT
        ? montantBrut - joursPresents * TAUX_CONTRIBUTION_REDUITE
        : 0;
      const montantNet = montantBrut - subvention;

      const facture = await this.prisma.facture.upsert({
        where: { parentId_mois_annee: { parentId: parent.id, mois, annee } },
        update: { nombreJours: joursPresents, tarifJournalier: tarif, montantBrut, montantSubvention: subvention, montantNet },
        create: {
          parentId: parent.id, mois, annee, nombreJours: joursPresents,
          tarifJournalier: tarif, montantBrut, montantSubvention: subvention, montantNet,
        },
      });
      factures.push(facture);
    }

    return factures;
  }

  async envoyerFacture(factureId: string) {
    const facture = await this.prisma.facture.findUniqueOrThrow({
      where: { id: factureId },
      include: { parent: true },
    });

    const nomMois = format(new Date(facture.annee, facture.mois - 1), 'MMMM yyyy', { locale: fr });

    await this.emails.send({
      to: facture.parent.email,
      toName: `${facture.parent.prenom} ${facture.parent.nom}`,
      subject: `Reçu de garde — ${nomMois}`,
      html: `
        <p>Bonjour ${facture.parent.prenom},</p>
        <p>Voici votre reçu de garde pour <strong>${nomMois}</strong> :</p>
        <table style="border-collapse:collapse;width:400px">
          <tr><td>Jours de garde :</td><td><strong>${facture.nombreJours} jours</strong></td></tr>
          <tr><td>Tarif journalier :</td><td>${Number(facture.tarifJournalier).toFixed(2)} $</td></tr>
          <tr><td>Montant brut :</td><td>${Number(facture.montantBrut).toFixed(2)} $</td></tr>
          <tr><td>Subvention :</td><td>-${Number(facture.montantSubvention).toFixed(2)} $</td></tr>
          <tr style="font-weight:bold"><td>Montant dû :</td><td>${Number(facture.montantNet).toFixed(2)} $</td></tr>
        </table>
        <p>Cordialement,<br>Votre RSGE</p>
      `,
    });

    await this.prisma.facture.update({
      where: { id: factureId },
      data: { statut: StatutFacture.ENVOYEE, dateEnvoi: new Date() },
    });

    return { message: 'Facture envoyée' };
  }

  async tableauDeBord(annee: number) {
    const factures = await this.prisma.facture.findMany({ where: { annee } });
    const totalBrut = factures.reduce((s, f) => s + Number(f.montantBrut), 0);
    const totalSubvention = factures.reduce((s, f) => s + Number(f.montantSubvention), 0);
    const totalNet = factures.reduce((s, f) => s + Number(f.montantNet), 0);
    return { annee, totalBrut, totalSubvention, totalNet, nbFactures: factures.length };
  }
}
