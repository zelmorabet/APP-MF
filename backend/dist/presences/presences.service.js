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
exports.PresencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const date_fns_1 = require("date-fns");
let PresencesService = class PresencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByDate(date) {
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
    async findByMois(mois, annee) {
        const debut = (0, date_fns_1.startOfMonth)(new Date(annee, mois - 1));
        const fin = (0, date_fns_1.endOfMonth)(debut);
        return this.prisma.presence.findMany({
            where: { date: { gte: debut, lte: fin } },
            include: { enfant: true },
            orderBy: [{ date: 'asc' }, { enfant: { nom: 'asc' } }],
        });
    }
    async upsertPresence(dto) {
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
    async saisieGroupee(dto) {
        const date = new Date(dto.date);
        const operations = dto.presences.map((p) => this.prisma.presence.upsert({
            where: { enfantId_date: { enfantId: p.enfantId, date } },
            update: { statut: p.statut, heureArrivee: p.heureArrivee, heureDepart: p.heureDepart, note: p.note },
            create: { enfantId: p.enfantId, date, statut: p.statut, heureArrivee: p.heureArrivee, heureDepart: p.heureDepart, note: p.note },
        }));
        return this.prisma.$transaction(operations);
    }
    async statsEnfant(enfantId, mois, annee) {
        const debut = (0, date_fns_1.startOfMonth)(new Date(annee, mois - 1));
        const fin = (0, date_fns_1.endOfMonth)(debut);
        const presences = await this.prisma.presence.findMany({
            where: { enfantId, date: { gte: debut, lte: fin } },
        });
        const stats = {
            present: 0, absent: 0, absentJustifie: 0, ferie: 0, fermeture: 0,
        };
        presences.forEach((p) => {
            if (p.statut === 'PRESENT')
                stats.present++;
            else if (p.statut === 'ABSENT')
                stats.absent++;
            else if (p.statut === 'ABSENT_JUSTIFIE')
                stats.absentJustifie++;
            else if (p.statut === 'CONGE_FERIE')
                stats.ferie++;
            else if (p.statut === 'FERMETURE')
                stats.fermeture++;
        });
        return { mois, annee, ...stats, total: presences.length };
    }
};
exports.PresencesService = PresencesService;
exports.PresencesService = PresencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PresencesService);
//# sourceMappingURL=presences.service.js.map