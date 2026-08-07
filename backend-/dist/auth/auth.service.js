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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../common/prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async login(dto) {
        const rsge = await this.prisma.rsge.findUnique({ where: { email: dto.email } });
        if (!rsge)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const valid = await bcrypt.compare(dto.motDePasse, rsge.motDePasse);
        if (!valid)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const payload = { sub: rsge.id, email: rsge.email };
        const accessToken = this.jwt.sign(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: this.config.get('JWT_EXPIRES_IN', '8h'),
        });
        const { motDePasse: _, nasChiffre: __, ...profile } = rsge;
        return { accessToken, profile };
    }
    async changePassword(rsgeId, currentPassword, newPassword) {
        const rsge = await this.prisma.rsge.findUniqueOrThrow({ where: { id: rsgeId } });
        const valid = await bcrypt.compare(currentPassword, rsge.motDePasse);
        if (!valid)
            throw new common_1.UnauthorizedException('Mot de passe actuel incorrect');
        const hash = await bcrypt.hash(newPassword, 12);
        await this.prisma.rsge.update({ where: { id: rsgeId }, data: { motDePasse: hash } });
        return { message: 'Mot de passe modifié avec succès' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map