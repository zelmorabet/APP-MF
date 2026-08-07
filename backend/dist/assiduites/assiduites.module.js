"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssiduitesModule = void 0;
const common_1 = require("@nestjs/common");
const assiduites_service_1 = require("./assiduites.service");
const assiduites_controller_1 = require("./assiduites.controller");
let AssiduitesModule = class AssiduitesModule {
};
exports.AssiduitesModule = AssiduitesModule;
exports.AssiduitesModule = AssiduitesModule = __decorate([
    (0, common_1.Module)({ providers: [assiduites_service_1.AssiduitesService], controllers: [assiduites_controller_1.AssiduitesController] })
], AssiduitesModule);
//# sourceMappingURL=assiduites.module.js.map