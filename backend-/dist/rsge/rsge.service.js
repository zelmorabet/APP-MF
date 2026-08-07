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
exports.RsgeService = exports.UpdateRsgeDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const crypto_service_1 = require("../common/crypto/crypto.service");
class UpdateRsgeDto {
}
exports.UpdateRsgeDto = UpdateRsgeDto;
let RsgeService = class RsgeService {
    constructor(prisma, crypto) {
        this.prisma = prisma;
        this.crypto = crypto;
    }
    async getProfil(id) {
        const rsge = await this.prisma.rsge.findUnique({ where: { id }, include: { bureauCoord: true } });
        if (!rsge)
            throw new common_1.NotFoundException();
        const { motDePasse: _, nasChiffre: __, ...safe } = rsge;
        return safe;
    }
    async update(id, dto) {
        const { nas, ...rest } = dto;
        const data = { ...rest };
        if (nas)
            data.nasChiffre = this.crypto.encrypt(nas);
        return this.prisma.rsge.update({ where: { id }, data });
    }
    async dashboard() {
        const today = new Date(new Date().toDateString());
        const [nbEnfants, nbParents, nbEntentesPending, nbPresencesAuj] = await Promise.all([
            this.prisma.enfant.count({ where: { actif: true } }),
            this.prisma.parent.count(),
            this.prisma.ententeService.count({ where: { statut: 'ENVOYEE_SIGNATURE' } }),
            this.prisma.presence.count({ where: { date: today, statut: 'PRESENT' } }),
        ]);
        return { nbEnfants, nbParents, nbEntentesPending, nbPresencesAuj };
    }
};
exports.RsgeService = RsgeService;
exports.RsgeService = RsgeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService])
], RsgeService);
//# sourceMappingURL=rsge.service.js.map