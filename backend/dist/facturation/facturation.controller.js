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
exports.FacturationController = void 0;
const common_1 = require("@nestjs/common");
const facturation_service_1 = require("./facturation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FacturationController = class FacturationController {
    constructor(service) {
        this.service = service;
    }
    findAll(annee) {
        return this.service.findAll(annee ? parseInt(annee) : undefined);
    }
    findByParent(id) {
        return this.service.findByParent(id);
    }
    tableauDeBord(annee) {
        return this.service.tableauDeBord(parseInt(annee));
    }
    generer(mois, annee) {
        return this.service.genererFacturesMois(parseInt(mois), parseInt(annee));
    }
    envoyer(id) {
        return this.service.envoyerFacture(id);
    }
};
exports.FacturationController = FacturationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacturationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('parent/:parentId'),
    __param(0, (0, common_1.Param)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacturationController.prototype, "findByParent", null);
__decorate([
    (0, common_1.Get)('tableau-de-bord/:annee'),
    __param(0, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacturationController.prototype, "tableauDeBord", null);
__decorate([
    (0, common_1.Post)('generer/:annee/:mois'),
    __param(0, (0, common_1.Param)('mois')),
    __param(1, (0, common_1.Param)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FacturationController.prototype, "generer", null);
__decorate([
    (0, common_1.Post)(':id/envoyer'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FacturationController.prototype, "envoyer", null);
exports.FacturationController = FacturationController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('facturation'),
    __metadata("design:paramtypes", [facturation_service_1.FacturationService])
], FacturationController);
//# sourceMappingURL=facturation.controller.js.map