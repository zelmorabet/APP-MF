"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./common/prisma/prisma.module");
const crypto_module_1 = require("./common/crypto/crypto.module");
const auth_module_1 = require("./auth/auth.module");
const rsge_module_1 = require("./rsge/rsge.module");
const enfants_module_1 = require("./enfants/enfants.module");
const parents_module_1 = require("./parents/parents.module");
const contacts_urgence_module_1 = require("./contacts-urgence/contacts-urgence.module");
const presences_module_1 = require("./presences/presences.module");
const assiduites_module_1 = require("./assiduites/assiduites.module");
const ententes_module_1 = require("./ententes/ententes.module");
const facturation_module_1 = require("./facturation/facturation.module");
const rapports_module_1 = require("./rapports/rapports.module");
const calendrier_module_1 = require("./calendrier/calendrier.module");
const documents_module_1 = require("./documents/documents.module");
const emails_module_1 = require("./emails/emails.module");
const signatures_module_1 = require("./signatures/signatures.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            crypto_module_1.CryptoModule,
            auth_module_1.AuthModule,
            rsge_module_1.RsgeModule,
            enfants_module_1.EnfantsModule,
            parents_module_1.ParentsModule,
            contacts_urgence_module_1.ContactsUrgenceModule,
            presences_module_1.PresencesModule,
            assiduites_module_1.AssiduitesModule,
            ententes_module_1.EntentesModule,
            facturation_module_1.FacturationModule,
            rapports_module_1.RapportsModule,
            calendrier_module_1.CalendrierModule,
            documents_module_1.DocumentsModule,
            emails_module_1.EmailsModule,
            signatures_module_1.SignaturesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map