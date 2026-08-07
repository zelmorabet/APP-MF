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
exports.EntentesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const emails_service_1 = require("../emails/emails.service");
const signatures_service_1 = require("../signatures/signatures.service");
let EntentesService = class EntentesService {
    constructor(prisma, emails, signatures) {
        this.prisma = prisma;
        this.emails = emails;
        this.signatures = signatures;
    }
    findAll() {
        return this.prisma.ententeService.findMany({
            include: { parent: true, enfant: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const e = await this.prisma.ententeService.findUnique({
            where: { id },
            include: { parent: true, enfant: true, signatureRequete: true },
        });
        if (!e)
            throw new common_1.NotFoundException();
        return e;
    }
    create(dto) {
        return this.prisma.ententeService.create({
            data: {
                ...dto,
                dateDebut: new Date(dto.dateDebut),
                dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
                tarifJournalier: dto.tarifJournalier,
            },
            include: { parent: true, enfant: true },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.dateDebut)
            data.dateDebut = new Date(dto.dateDebut);
        if (dto.dateFin)
            data.dateFin = new Date(dto.dateFin);
        return this.prisma.ententeService.update({ where: { id }, data });
    }
    async envoyerPourSignature(id) {
        return this.signatures.envoyerPourSignature(id);
    }
    findByParent(parentId) {
        return this.prisma.ententeService.findMany({
            where: { parentId },
            include: { enfant: true, signatureRequete: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    findByEnfant(enfantId) {
        return this.prisma.ententeService.findMany({
            where: { enfantId },
            include: { parent: true, signatureRequete: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.EntentesService = EntentesService;
exports.EntentesService = EntentesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emails_service_1.EmailsService,
        signatures_service_1.SignaturesService])
], EntentesService);
//# sourceMappingURL=ententes.service.js.map