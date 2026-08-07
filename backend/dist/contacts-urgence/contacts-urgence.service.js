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
exports.ContactsUrgenceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ContactsUrgenceService = class ContactsUrgenceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findByEnfant(enfantId) {
        return this.prisma.contactUrgence.findUnique({ where: { enfantId } });
    }
    async create(dto) {
        const existing = await this.prisma.contactUrgence.findUnique({ where: { enfantId: dto.enfantId } });
        if (existing)
            throw new common_1.ConflictException('Cet enfant a déjà un contact d\'urgence');
        return this.prisma.contactUrgence.create({ data: dto });
    }
    async update(id, dto) {
        if (!await this.prisma.contactUrgence.findUnique({ where: { id } }))
            throw new common_1.NotFoundException();
        return this.prisma.contactUrgence.update({ where: { id }, data: dto });
    }
    async delete(id) {
        if (!await this.prisma.contactUrgence.findUnique({ where: { id } }))
            throw new common_1.NotFoundException();
        return this.prisma.contactUrgence.delete({ where: { id } });
    }
};
exports.ContactsUrgenceService = ContactsUrgenceService;
exports.ContactsUrgenceService = ContactsUrgenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactsUrgenceService);
//# sourceMappingURL=contacts-urgence.service.js.map