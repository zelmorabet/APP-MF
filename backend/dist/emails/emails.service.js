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
var EmailsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
let EmailsService = EmailsService_1 = class EmailsService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailsService_1.name);
        const key = config.get('SENDGRID_API_KEY', '');
        this.useSendGrid = key.startsWith('SG.');
        if (this.useSendGrid)
            sgMail.setApiKey(key);
    }
    async send(payload) {
        if (this.useSendGrid) {
            await this.sendViaSendGrid(payload);
        }
        else {
            await this.sendViaNodemailer(payload);
        }
    }
    async envoyerDocument(to, toName, nomDoc, pdfBuffer) {
        await this.send({
            to,
            toName,
            subject: `Document à signer — ${nomDoc}`,
            html: `
        <p>Bonjour ${toName},</p>
        <p>Veuillez trouver ci-joint le document <strong>${nomDoc}</strong> pour votre milieu familial.</p>
        <p>Cordialement,<br>Votre RSGE</p>
      `,
            attachments: [{ filename: `${nomDoc}.pdf`, content: pdfBuffer, type: 'application/pdf' }],
        });
    }
    async envoyerDemandeSignature(to, toName, lienSignature, nomDoc) {
        await this.send({
            to,
            toName,
            subject: `Signature requise — ${nomDoc}`,
            html: `
        <p>Bonjour ${toName},</p>
        <p>Votre signature est requise pour le document : <strong>${nomDoc}</strong>.</p>
        <p><a href="${lienSignature}" style="background:#3b82f6;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
          Signer le document
        </a></p>
        <p>Ce lien est valide 7 jours.</p>
        <p>Cordialement,<br>Votre RSGE</p>
      `,
        });
    }
    async envoyerFicheAssiduité(to, toName, mois, pdfBuffer) {
        await this.send({
            to,
            toName,
            subject: `Fiche d'assiduité — ${mois}`,
            html: `
        <p>Bonjour ${toName},</p>
        <p>Veuillez trouver ci-joint la fiche d'assiduité pour <strong>${mois}</strong>.</p>
        <p>Cordialement,<br>Votre RSGE</p>
      `,
            attachments: [{ filename: `Assiduité-${mois}.pdf`, content: pdfBuffer, type: 'application/pdf' }],
        });
    }
    async sendViaSendGrid(payload) {
        try {
            await sgMail.send({
                to: { email: payload.to, name: payload.toName },
                from: { email: this.config.get('EMAIL_FROM', ''), name: this.config.get('EMAIL_FROM_NAME', '') },
                subject: payload.subject,
                html: payload.html,
                attachments: payload.attachments?.map((a) => ({
                    filename: a.filename,
                    content: a.content.toString('base64'),
                    type: a.type,
                    disposition: 'attachment',
                })),
            });
        }
        catch (err) {
            this.logger.error(`SendGrid error: ${err.message}`);
            throw err;
        }
    }
    async sendViaNodemailer(payload) {
        const transporter = nodemailer.createTransport({
            host: this.config.get('SMTP_HOST', 'smtp.mailtrap.io'),
            port: parseInt(this.config.get('SMTP_PORT', '587')),
            auth: {
                user: this.config.get('SMTP_USER', ''),
                pass: this.config.get('SMTP_PASS', ''),
            },
        });
        await transporter.sendMail({
            from: `"${this.config.get('EMAIL_FROM_NAME')}" <${this.config.get('EMAIL_FROM')}>`,
            to: payload.toName ? `"${payload.toName}" <${payload.to}>` : payload.to,
            subject: payload.subject,
            html: payload.html,
            attachments: payload.attachments?.map((a) => ({
                filename: a.filename,
                content: a.content,
                contentType: a.type,
            })),
        });
    }
};
exports.EmailsService = EmailsService;
exports.EmailsService = EmailsService = EmailsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailsService);
//# sourceMappingURL=emails.service.js.map