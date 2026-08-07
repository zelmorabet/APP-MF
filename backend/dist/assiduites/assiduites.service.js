"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssiduitesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const emails_service_1 = require("../emails/emails.service");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const pdf_lib_1 = require("pdf-lib");
const client_1 = require("@prisma/client");
let AssiduitesService = class AssiduitesService {
    constructor(prisma, emails) {
        this.prisma = prisma;
        this.emails = emails;
    }
    findAll() {
        return this.prisma.feuilleAssiduite.findMany({ orderBy: [{ annee: 'desc' }, { mois: 'desc' }] });
    }
    findOne(mois, annee) {
        return this.prisma.feuilleAssiduite.findUnique({
            where: { mois_annee: { mois, annee } },
            include: { presences: { include: { enfant: true }, orderBy: [{ date: 'asc' }] } },
        });
    }
    async generer(mois, annee) {
        const debut = (0, date_fns_1.startOfMonth)(new Date(annee, mois - 1));
        const fin = (0, date_fns_1.endOfMonth)(debut);
        const feuille = await this.prisma.feuilleAssiduite.upsert({
            where: { mois_annee: { mois, annee } },
            update: { statut: client_1.StatutFeuille.GENEREE, dateGeneration: new Date() },
            create: { mois, annee, statut: client_1.StatutFeuille.GENEREE, dateGeneration: new Date() },
        });
        await this.prisma.presence.updateMany({
            where: { date: { gte: debut, lte: fin } },
            data: { feuilleId: feuille.id },
        });
        return this.findOne(mois, annee);
    }
    async genererPdf(mois, annee) {
        const feuille = await this.findOne(mois, annee);
        const nomMois = (0, date_fns_1.format)(new Date(annee, mois - 1), 'MMMM yyyy', { locale: locale_1.fr });
        const doc = await pdf_lib_1.PDFDocument.create();
        const page = doc.addPage([595, 842]);
        const font = await doc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const fontBold = await doc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
        const { height, width } = page.getSize();
        page.drawText("FEUILLE D'ASSIDUITÉ — MILIEU FAMILIAL", { x: 50, y: height - 60, size: 16, font: fontBold, color: (0, pdf_lib_1.rgb)(0.15, 0.35, 0.65) });
        page.drawText(`Période : ${nomMois.toUpperCase()}`, { x: 50, y: height - 85, size: 12, font });
        let y = height - 130;
        page.drawText('Enfant', { x: 50, y, size: 10, font: fontBold });
        page.drawText('Jours présents', { x: 250, y, size: 10, font: fontBold });
        page.drawText('Absences', { x: 380, y, size: 10, font: fontBold });
        page.drawText('Total jours', { x: 480, y, size: 10, font: fontBold });
        y -= 15;
        page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: (0, pdf_lib_1.rgb)(0.7, 0.7, 0.7) });
        const parEnfant = new Map();
        feuille?.presences?.forEach((p) => {
            if (!parEnfant.has(p.enfantId))
                parEnfant.set(p.enfantId, []);
            parEnfant.get(p.enfantId).push(p);
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
    async envoyerAuBC(mois, annee, emailBC) {
        const pdfBuffer = await this.genererPdf(mois, annee);
        const nomMois = (0, date_fns_1.format)(new Date(annee, mois - 1), 'MMMM yyyy', { locale: locale_1.fr });
        await this.emails.send({
            to: emailBC,
            subject: `Feuille d'assiduité — ${nomMois}`,
            html: `<p>Bonjour,</p><p>Veuillez trouver ci-joint la feuille d'assiduité pour ${nomMois}.</p>`,
            attachments: [{ filename: `Assiduité-${nomMois}.pdf`, content: pdfBuffer, type: 'application/pdf' }],
        });
        await this.prisma.feuilleAssiduite.update({
            where: { mois_annee: { mois, annee } },
            data: { statut: client_1.StatutFeuille.ENVOYEE_BC, dateEnvoi: new Date() },
        });
        return { message: `Feuille d'assiduité envoyée au BC` };
    }
};
exports.AssiduitesService = AssiduitesService;
exports.AssiduitesService = AssiduitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emails_service_1.EmailsService])
], AssiduitesService);
//# sourceMappingURL=assiduites.service.js.map