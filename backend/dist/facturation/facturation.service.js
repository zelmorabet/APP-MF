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
exports.FacturationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const emails_service_1 = require("../emails/emails.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const TAUX_CONTRIBUTION_REDUITE = 10.35;
let FacturationService = class FacturationService {
    constructor(prisma, emails) {
        this.prisma = prisma;
        this.emails = emails;
    }
    findAll(annee) {
        return this.prisma.facture.findMany({
            where: annee ? { annee } : {},
            include: { parent: true, subventions: true },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
        });
    }
    findByParent(parentId) {
        return this.prisma.facture.findMany({
            where: { parentId },
            include: { subventions: true },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
        });
    }
    async genererFacturesMois(mois, annee) {
        const debut = (0, date_fns_1.startOfMonth)(new Date(annee, mois - 1));
        const fin = (0, date_fns_1.endOfMonth)(debut);
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
        const factures = [];
        for (const parent of parents) {
            const entente = await this.prisma.ententeService.findFirst({
                where: { parentId: parent.id, statut: 'SIGNEE' },
                orderBy: { createdAt: 'desc' },
            });
            const joursPresents = parent.enfants.reduce((acc, ep) => acc + ep.enfant.presences.length, 0);
            if (joursPresents === 0)
                continue;
            const tarif = entente ? Number(entente.tarifJournalier) : TAUX_CONTRIBUTION_REDUITE;
            const montantBrut = joursPresents * tarif;
            const subvention = parent.typeContribution === client_1.TypeContribution.REDUIT
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
    async envoyerFacture(factureId) {
        const facture = await this.prisma.facture.findUniqueOrThrow({
            where: { id: factureId },
            include: { parent: true },
        });
        const nomMois = (0, date_fns_1.format)(new Date(facture.annee, facture.mois - 1), 'MMMM yyyy', { locale: locale_1.fr });
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
            data: { statut: client_1.StatutFacture.ENVOYEE, dateEnvoi: new Date() },
        });
        return { message: 'Facture envoyée' };
    }
    async tableauDeBord(annee) {
        const factures = await this.prisma.facture.findMany({ where: { annee } });
        const totalBrut = factures.reduce((s, f) => s + Number(f.montantBrut), 0);
        const totalSubvention = factures.reduce((s, f) => s + Number(f.montantSubvention), 0);
        const totalNet = factures.reduce((s, f) => s + Number(f.montantNet), 0);
        return { annee, totalBrut, totalSubvention, totalNet, nbFactures: factures.length };
    }
};
exports.FacturationService = FacturationService;
exports.FacturationService = FacturationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emails_service_1.EmailsService])
], FacturationService);
//# sourceMappingURL=facturation.service.js.map