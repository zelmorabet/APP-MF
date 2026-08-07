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
exports.SignaturesController = void 0;
const common_1 = require("@nestjs/common");
const signatures_service_1 = require("./signatures.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SignaturesController = class SignaturesController {
    constructor(service) {
        this.service = service;
    }
    findAll() { return this.service.findAll(); }
    envoyer(id) {
        return this.service.envoyerPourSignature(id);
    }
    webhook(body) {
        return this.service.handleWebhook(body);
    }
};
exports.SignaturesController = SignaturesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SignaturesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('entente/:id/envoyer'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SignaturesController.prototype, "envoyer", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SignaturesController.prototype, "webhook", null);
exports.SignaturesController = SignaturesController = __decorate([
    (0, common_1.Controller)('signatures'),
    __metadata("design:paramtypes", [signatures_service_1.SignaturesService])
], SignaturesController);
//# sourceMappingURL=signatures.controller.js.map