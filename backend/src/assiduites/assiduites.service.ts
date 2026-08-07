import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { StatutFeuille } from '@prisma/client';

@Injectable()
export class AssiduitesService {
  constructor(
    private prisma: PrismaService,
    private emails: EmailsService,
  ) {}

  findAll() {
    return this.prisma.feuilleAssiduite.findMany({ orderBy: [{ annee: 'desc' }, { mois: 'desc' }] });
  }

  findOne(mois: number, annee: number) {
    return this.prisma.feuilleAssiduite.findUnique({
      where: { mois_annee: { mois, annee } },
      include: { presences: { include: { enfant: true }, orderBy: [{ date: 'asc' }] } },
    });
  }

  async generer(mois: number, annee: number) {
    const debut = startOfMonth(new Date(annee, mois - 1));
    const fin = endOfMonth(debut);
    const feuille = await this.prisma.feuilleAssiduite.upsert({
      where: { mois_annee: { mois, annee } },
      update: { statut: StatutFeuille.GENEREE, dateGeneration: new Date() },
      create: { mois, annee, statut: StatutFeuille.GENEREE, dateGeneration: new Date() },
    });
    await this.prisma.presence.updateMany({
      where: { date: { gte: debut, lte: fin } },
      data: { feuilleId: feuille.id },
    });
    return this.findOne(mois, annee);
  }

  async genererPdf(mois: number, annee: number): Promise<Buffer> {
    const feuille = await this.findOne(mois, annee);
    const nomMois = format(new Date(annee, mois - 1), 'MMMM yyyy', { locale: fr });
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const { height, width } = page.getSize();
    page.drawText("FEUILLE D'ASSIDUITÉ — MILIEU FAMILIAL", { x: 50, y: height - 60, size: 16, font: fontBold, color: rgb(0.15, 0.35, 0.65) });
    page.drawText(`Période : ${nomMois.toUpperCase()}`, { x: 50, y: height - 85, size: 12, font });
    let y = height - 130;
    page.drawText('Enfant', { x: 50, y, size: 10, font: fontBold });
    page.drawText('Jours présents', { x: 250, y, size: 10, font: fontBold });
    page.drawText('Absences', { x: 380, y, size: 10, font: fontBold });
    page.drawText('Total jours', { x: 480, y, size: 10, font: fontBold });
    y -= 15;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.7, 0.7, 0.7) });
    const parEnfant = new Map<string, NonNullable<typeof feuille>['presences']>();
    feuille?.presences?.forEach((p) => {
      if (!parEnfant.has(p.enfantId)) parEnfant.set(p.enfantId, []);
      parEnfant.get(p.enfantId)!.push(p);
    });
    for (const [, pres] of parEnfant) {
      const enfant = pres[0].enfant;
      const presents = pres.filter((p) => p.statut === 'PRESENT').length;
      const absents = pres.filter((p) => p.statut === 'ABSENT' || p.statut === 'ABSENT_JUSTIFIE').length;
      y -= 20;
      page.drawText(`${enfant.prenom} ${enfant.nom}`, { x: 50, y, size: 9, font });
      page.drawText(String(presents), { x: 280, y, size: 9, font });
      page.drawText(String(absents), { x: 400, y, size: 9, font });
      page.drawText(String(pres.length), { x: 500, y, size: 9, font });
    }
    page.drawText('Signature RSGE : _______________________   Date : _______________', { x: 50, y: 80, size: 10, font });
    const pdfBytes = await doc.save();
    return Buffer.from(pdfBytes);
  }

  async envoyerAuBC(mois: number, annee: number, emailBC: string) {
    const pdfBuffer = await this.genererPdf(mois, annee);
    const nomMois = format(new Date(annee, mois - 1), 'MMMM yyyy', { locale: fr });
    await this.emails.send({
      to: emailBC,
      subject: `Feuille d'assiduité — ${nomMois}`,
      html: `<p>Bonjour,</p><p>Veuillez trouver ci-joint la feuille d'assiduité pour ${nomMois}.</p>`,
      attachments: [{ filename: `Assiduité-${nomMois}.pdf`, content: pdfBuffer, type: 'application/pdf' }],
    });
    await this.prisma.feuilleAssiduite.update({
      where: { mois_annee: { mois, annee } },
      data: { statut: StatutFeuille.ENVOYEE_BC, dateEnvoi: new Date() },
    });
    return { message: `Feuille d'assiduité envoyée au BC` };
  }
}
