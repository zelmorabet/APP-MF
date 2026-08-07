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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssiduitesController = void 0;
const common_1 = require("@nestjs/common");
const assiduites_service_1 = require("./assiduites.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AssiduitesController = class AssiduitesController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    findOne(mois, annee) {
        return this.service.findOne(parseInt(mois), parseInt(annee));
    }
    generer(mois, annee) {
        return this.service.generer(parseInt(mois), parseInt(annee));
    }
    async telechargerPdf(mois, annee, res) {
        const buf = await this.service.genererPdf(parseInt(mois), parseInt(annee));
        res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="assiduité-${annee}-${mois}.pdf"` });
        res.send(buf);
    }
    envoyerBC(mois, annee, emailBC) {
        return this.service.envoyerAuBC(parseInt(mois), parseInt(annee), emailBC);
    }
};
exports.AssiduitesController = AssiduitesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssiduitesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':annee/:mois'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssiduitesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':annee/:mois/generer'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssiduitesController.prototype, "generer", null);
__decorate([
    (0, common_1.Get)(':annee/:mois/pdf'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AssiduitesController.prototype, "telechargerPdf", null);
__decorate([
    (0, common_1.Post)(':annee/:mois/envoyer-bc'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __param(2, (0, common_1.Body)('emailBC')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AssiduitesController.prototype, "envoyerBC", null);
exports.AssiduitesController = AssiduitesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('assiduites'),
    __metadata("design:paramtypes", [assiduites_service_1.AssiduitesService])
], AssiduitesController);
//# sourceMappingURL=assiduites.controller.js.map