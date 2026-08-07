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
exports.RapportsController = void 0;
const common_1 = require("@nestjs/common");
const rapports_service_1 = require("./rapports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RapportsController = class RapportsController {
    constructor(service) {
        this.service = service;
    }
    assiduites(mois, annee) {
        return this.service.rapportAssiduiteMensuel(parseInt(mois), parseInt(annee));
    }
    inscriptions() { return this.service.rapportInscriptions(); }
    fermetures(annee) {
        return this.service.rapportFermetures(parseInt(annee));
    }
    facturation(annee) {
        return this.service.rapportFacturationAnnuelle(parseInt(annee));
    }
    envoyerBC(mois, annee, emailBC) {
        return this.service.envoyerRapportBC(parseInt(mois), parseInt(annee), emailBC);
    }
};
exports.RapportsController = RapportsController;
__decorate([
    (0, common_1.Get)('assiduites/:annee/:mois'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "assiduites", null);
__decorate([
    (0, common_1.Get)('inscriptions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "inscriptions", null);
__decorate([
    (0, common_1.Get)('fermetures/:annee'),
    __param(0, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "fermetures", null);
__decorate([
    (0, common_1.Get)('facturation/:annee'),
    __param(0, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "facturation", null);
__decorate([
    (0, common_1.Post)('assiduites/:annee/:mois/envoyer-bc'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __param(2, (0, common_1.Body)('emailBC')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], RapportsController.prototype, "envoyerBC", null);
exports.RapportsController = RapportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rapports'),
    __metadata("design:paramtypes", [rapports_service_1.RapportsService])
], RapportsController);
//# sourceMappingURL=rapports.controller.js.map