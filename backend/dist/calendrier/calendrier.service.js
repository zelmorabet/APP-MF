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
exports.CalendrierService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
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
let CalendrierService = class CalendrierService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(debut, fin) {
        return this.prisma.calendrierEvenement.findMany({
            where: debut && fin ? { dateDebut: { gte: debut, lte: fin } } : {},
            orderBy: { dateDebut: 'asc' },
        });
    }
    create(dto) {
        return this.prisma.calendrierEvenement.create({
            data: {
                ...dto,
                dateDebut: new Date(dto.dateDebut),
                dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
            },
        });
    }
    update(id, dto) {
        const data = { ...dto };
        if (dto.dateDebut)
            data.dateDebut = new Date(dto.dateDebut);
        if (dto.dateFin)
            data.dateFin = new Date(dto.dateFin);
        return this.prisma.calendrierEvenement.update({ where: { id }, data });
    }
    delete(id) {
        return this.prisma.calendrierEvenement.delete({ where: { id } });
    }
    async importerFeriesQuebec() {
        const ops = FERIES_QUEBEC.map((f) => this.prisma.calendrierEvenement.create({
            data: { titre: f.titre, type: 'FERIE', dateDebut: new Date(f.date), touteJournee: true, couleur: '#ef4444' },
        }));
        return Promise.allSettled(ops);
    }
};
exports.CalendrierService = CalendrierService;
exports.CalendrierService = CalendrierService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendrierService);
//# sourceMappingURL=calendrier.service.js.map