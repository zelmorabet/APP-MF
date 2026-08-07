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
var SignaturesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignaturesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../common/prisma/prisma.service");
const axios_1 = require("axios");
let SignaturesService = SignaturesService_1 = class SignaturesService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(SignaturesService_1.name);
        this.apiKey = config.get('DROPBOX_SIGN_API_KEY', '');
    }
    async envoyerPourSignature(ententeId) {
        const entente = await this.prisma.ententeService.findUniqueOrThrow({
            where: { id: ententeId },
            include: { parent: true, enfant: true },
        });
        if (!this.apiKey) {
            const fakeReq = await this.prisma.signatureRequete.create({
                data: {
                    signataire: `${entente.parent.prenom} ${entente.parent.nom}`,
                    email: entente.parent.email,
                    statut: 'ENVOYE',
                    lienSignature: `https://app.hellosign.com/sign/fake-${ententeId}`,
                },
            });
            await this.prisma.ententeService.update({
                where: { id: ententeId },
                data: { signatureReqId: fakeReq.id, statut: 'ENVOYEE_SIGNATURE' },
            });
            return fakeReq;
        }
        try {
            const response = await axios_1.default.post('https://api.hellosign.com/v3/signature_request/send', {
                title: `Entente de services — ${entente.enfant.prenom} ${entente.enfant.nom}`,
                signers: [{ email_address: entente.parent.email, name: `${entente.parent.prenom} ${entente.parent.nom}` }],
                files: [{ name: 'entente.pdf', mime_type: 'application/pdf', file_url: entente.pdfUrl }],
            }, { auth: { username: this.apiKey, password: '' } });
            const signReqId = response.data.signature_request.signature_request_id;
            const signerInfo = response.data.signature_request.signatures[0];
            const req = await this.prisma.signatureRequete.create({
                data: {
                    dropboxSignId: signReqId,
                    signataire: `${entente.parent.prenom} ${entente.parent.nom}`,
                    email: entente.parent.email,
                    statut: 'ENVOYE',
                    lienSignature: signerInfo?.sign_url,
                },
            });
            await this.prisma.ententeService.update({
                where: { id: ententeId },
                data: { signatureReqId: req.id, statut: 'ENVOYEE_SIGNATURE' },
            });
            return req;
        }
        catch (err) {
            this.logger.error(`Dropbox Sign error: ${err.message}`);
            throw err;
        }
    }
    async handleWebhook(event) {
        const { event_type, signature_request } = event;
        const dropboxSignId = signature_request?.signature_request_id;
        if (!dropboxSignId)
            return;
        if (event_type === 'signature_request_signed') {
            await this.prisma.signatureRequete.updateMany({
                where: { dropboxSignId },
                data: { statut: 'SIGNE', dateSignature: new Date() },
            });
            const req = await this.prisma.signatureRequete.findFirst({ where: { dropboxSignId } });
            if (req) {
                await this.prisma.ententeService.updateMany({
                    where: { signatureReqId: req.id },
                    data: { statut: 'SIGNEE', dateSignature: new Date() },
                });
            }
        }
    }
    findAll() {
        return this.prisma.signatureRequete.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.SignaturesService = SignaturesService;
exports.SignaturesService = SignaturesService = SignaturesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SignaturesService);
//# sourceMappingURL=signatures.service.js.map