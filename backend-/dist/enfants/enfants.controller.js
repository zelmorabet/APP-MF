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
exports.EnfantsController = void 0;
const common_1 = require("@nestjs/common");
const enfants_service_1 = require("./enfants.service");
const create_enfant_dto_1 = require("./dto/create-enfant.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EnfantsController = class EnfantsController {
    constructor(service) {
        this.service = service;
    }
    findAll(actif) {
        return this.service.findAll(actif !== 'false');
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    desactiver(id) {
        return this.service.desactiver(id);
    }
    lierParent(enfantId, body) {
        return this.service.lierParent(enfantId, body.parentId, body.relation, body.estCustodial);
    }
    delierParent(enfantId, parentId) {
        return this.service.delierParent(enfantId, parentId);
    }
};
exports.EnfantsController = EnfantsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('actif')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enfant_dto_1.CreateEnfantDto]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "desactiver", null);
__decorate([
    (0, common_1.Post)(':id/parents'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "lierParent", null);
__decorate([
    (0, common_1.Delete)(':id/parents/:parentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EnfantsController.prototype, "delierParent", null);
exports.EnfantsController = EnfantsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('enfants'),
    __metadata("design:paramtypes", [enfants_service_1.EnfantsService])
], EnfantsController);
//# sourceMappingURL=enfants.controller.js.map