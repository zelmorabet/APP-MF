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
exports.RsgeController = void 0;
const common_1 = require("@nestjs/common");
const rsge_service_1 = require("./rsge.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RsgeController = class RsgeController {
    constructor(service) {
        this.service = service;
    }
    profil(req) { return this.service.getProfil(req.user.id); }
    dashboard() { return this.service.dashboard(); }
    update(req, dto) {
        return this.service.update(req.user.id, dto);
    }
};
exports.RsgeController = RsgeController;
__decorate([
    (0, common_1.Get)('profil'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RsgeController.prototype, "profil", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RsgeController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Put)('profil'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rsge_service_1.UpdateRsgeDto]),
    __metadata("design:returntype", void 0)
], RsgeController.prototype, "update", null);
exports.RsgeController = RsgeController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rsge'),
    __metadata("design:paramtypes", [rsge_service_1.RsgeService])
], RsgeController);
//# sourceMappingURL=rsge.controller.js.map