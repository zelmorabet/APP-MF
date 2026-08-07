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
exports.PresencesController = void 0;
const common_1 = require("@nestjs/common");
const presences_service_1 = require("./presences.service");
const create_presence_dto_1 = require("./dto/create-presence.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PresencesController = class PresencesController {
    constructor(service) {
        this.service = service;
    }
    findByDate(date) {
        return this.service.findByDate(date);
    }
    findByMois(mois, annee) {
        return this.service.findByMois(parseInt(mois), parseInt(annee));
    }
    stats(enfantId, mois, annee) {
        return this.service.statsEnfant(enfantId, parseInt(mois), parseInt(annee));
    }
    upsert(dto) {
        return this.service.upsertPresence(dto);
    }
    saisieGroupee(dto) {
        return this.service.saisieGroupee(dto);
    }
};
exports.PresencesController = PresencesController;
__decorate([
    (0, common_1.Get)('date/:date'),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PresencesController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)('mois'),
    __param(0, (0, common_1.Query)('mois')),
    __param(1, (0, common_1.Query)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresencesController.prototype, "findByMois", null);
__decorate([
    (0, common_1.Get)('stats/:enfantId'),
    __param(0, (0, common_1.Param)('enfantId')),
    __param(1, (0, common_1.Query)('mois')),
    __param(2, (0, common_1.Query)('annee')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PresencesController.prototype, "stats", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_presence_dto_1.CreatePresenceDto]),
    __metadata("design:returntype", void 0)
], PresencesController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_presence_dto_1.BulkPresenceDto]),
    __metadata("design:returntype", void 0)
], PresencesController.prototype, "saisieGroupee", null);
exports.PresencesController = PresencesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('presences'),
    __metadata("design:paramtypes", [presences_service_1.PresencesService])
], PresencesController);
//# sourceMappingURL=presences.controller.js.map