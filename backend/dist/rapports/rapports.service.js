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
exports.RapportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const emails_service_1 = require("../emails/emails.service");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
let RapportsService = class RapportsService {
    constructor(prisma, emails) {
        this.prisma = prisma;
        this.emails = emails;
    }
    async rapportAssiduiteMensuel(mois, annee) {
        const debut = (0, date_fns_1.startOfMonth)(new Date(annee, mois - 1));
        const fin = (0, date_fns_1.endOfMonth)(debut);
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
        return { mois, annee, periode: (0, date_fns_1.format)(debut, 'MMMM yyyy', { locale: locale_1.fr }), lignes };
    }
    async rapportInscriptions() {
        const enfants = await this.prisma.enfant.findMany({
            include: { parents: { include: { parent: true } } },
            orderBy: [{ actif: 'desc' }, { nom: 'asc' }],
        });
        return { total: enfants.length, actifs: enfants.filter((e) => e.actif).length, enfants };
    }
    async rapportFermetures(annee) {
        return this.prisma.calendrierEvenement.findMany({
            where: {
                type: { in: ['FERMETURE', 'FERIE'] },
                dateDebut: { gte: new Date(annee, 0, 1), lte: new Date(annee, 11, 31) },
            },
            orderBy: { dateDebut: 'asc' },
        });
    }
    async rapportFacturationAnnuelle(annee) {
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
    async envoyerRapportBC(mois, annee, emailBC) {
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
};
exports.RapportsService = RapportsService;
exports.RapportsService = RapportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emails_service_1.EmailsService])
], RapportsService);
//# sourceMappingURL=rapports.service.js.map