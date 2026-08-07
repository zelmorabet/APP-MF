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
exports.EnfantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
let EnfantsService = class EnfantsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(actifSeulement = true) {
        return this.prisma.enfant.findMany({
            where: actifSeulement ? { actif: true } : {},
            include: { parents: { include: { parent: true } }, contactUrgence: true },
            orderBy: { nom: 'asc' },
        });
    }
    async findOne(id) {
        const enfant = await this.prisma.enfant.findUnique({
            where: { id },
            include: {
                parents: { include: { parent: true } },
                contactUrgence: true,
                presences: { orderBy: { date: 'desc' }, take: 30 },
                ententes: { orderBy: { createdAt: 'desc' }, take: 5 },
            },
        });
        if (!enfant)
            throw new common_1.NotFoundException(`Enfant ${id} introuvable`);
        return enfant;
    }
    async create(dto) {
        const count = await this.prisma.enfant.count({ where: { actif: true } });
        if (count >= 9)
            throw new common_1.BadRequestException('Maximum 9 enfants actifs atteint');
        const groupeAge = this.calculerGroupeAge(new Date(dto.dateNaissance));
        return this.prisma.enfant.create({ data: { ...dto, dateNaissance: new Date(dto.dateNaissance), groupeAge } });
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.dateNaissance) {
            data.dateNaissance = new Date(dto.dateNaissance);
            data.groupeAge = this.calculerGroupeAge(data.dateNaissance);
        }
        return this.prisma.enfant.update({ where: { id }, data });
    }
    async desactiver(id) {
        await this.findOne(id);
        return this.prisma.enfant.update({ where: { id }, data: { actif: false, dateDepart: new Date() } });
    }
    async lierParent(enfantId, parentId, relation, estCustodial = true) {
        const existing = await this.prisma.enfantParent.findUnique({ where: { enfantId_parentId: { enfantId, parentId } } });
        if (!existing) {
            const count = await this.prisma.enfantParent.count({ where: { enfantId } });
            if (count >= 2)
                throw new common_1.BadRequestException('Un enfant ne peut avoir que deux parents');
        }
        return this.prisma.enfantParent.upsert({
            where: { enfantId_parentId: { enfantId, parentId } },
            update: { relation, estCustodial },
            create: { enfantId, parentId, relation, estCustodial },
        });
    }
    async delierParent(enfantId, parentId) {
        return this.prisma.enfantParent.delete({ where: { enfantId_parentId: { enfantId, parentId } } });
    }
    calculerGroupeAge(ddn) {
        const mois = (0, date_fns_1.differenceInMonths)(new Date(), ddn);
        if (mois < 18)
            return client_1.GroupeAge.POUPON;
        if (mois < 36)
            return client_1.GroupeAge.BAMBIN;
        if (mois < 72)
            return client_1.GroupeAge.PRESCOLAIRE;
        return client_1.GroupeAge.SCOLAIRE;
    }
};
exports.EnfantsService = EnfantsService;
exports.EnfantsService = EnfantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnfantsService);
//# sourceMappingURL=enfants.service.js.map