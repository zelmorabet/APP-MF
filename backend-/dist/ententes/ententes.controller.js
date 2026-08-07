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
exports.EntentesController = void 0;
const common_1 = require("@nestjs/common");
const ententes_service_1 = require("./ententes.service");
const create_entente_dto_1 = require("./dto/create-entente.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EntentesController = class EntentesController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    findOne(id) { return this.service.findOne(id); }
    findByParent(id) { return this.service.findByParent(id); }
    findByEnfant(id) { return this.service.findByEnfant(id); }
    create(dto) { return this.service.create(dto); }
    update(id, dto) { return this.service.update(id, dto); }
    envoyerSignature(id) {
        return this.service.envoyerPourSignature(id);
    }
};
exports.EntentesController = EntentesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('parent/:parentId'),
    __param(0, (0, common_1.Param)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "findByParent", null);
__decorate([
    (0, common_1.Get)('enfant/:enfantId'),
    __param(0, (0, common_1.Param)('enfantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "findByEnfant", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_entente_dto_1.CreateEntenteDto]),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/envoyer-signature'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntentesController.prototype, "envoyerSignature", null);
exports.EntentesController = EntentesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ententes'),
    __metadata("design:paramtypes", [ententes_service_1.EntentesService])
], EntentesController);
//# sourceMappingURL=ententes.controller.js.map