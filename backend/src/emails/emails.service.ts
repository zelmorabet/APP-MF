import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';

export interface EmailPayload {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer; type: string }>;
}

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private readonly useSendGrid: boolean;

  constructor(private config: ConfigService) {
    const key = config.get<string>('SENDGRID_API_KEY', '');
    this.useSendGrid = key.startsWith('SG.');
    if (this.useSendGrid) sgMail.setApiKey(key);
  }

  async send(payload: EmailPayload): Promise<void> {
    if (this.useSendGrid) {
      await this.sendViaSendGrid(payload);
    } else {
      await this.sendViaNodemailer(payload);
    }
  }

  async envoyerDocument(to: string, toName: string, nomDoc: string, pdfBuffer: Buffer): Promise<void> {
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

  async envoyerDemandeSignature(to: string, toName: string, lienSignature: string, nomDoc: string): Promise<void> {
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

  async envoyerFicheAssiduité(to: string, toName: string, mois: string, pdfBuffer: Buffer): Promise<void> {
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

  private async sendViaSendGrid(payload: EmailPayload): Promise<void> {
    try {
      await sgMail.send({
        to: { email: payload.to, name: payload.toName },
        from: { email: this.config.get<string>('EMAIL_FROM', ''), name: this.config.get<string>('EMAIL_FROM_NAME', '') },
        subject: payload.subject,
        html: payload.html,
        attachments: payload.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content.toString('base64'),
          type: a.type,
          disposition: 'attachment',
        })),
      });
    } catch (err) {
      this.logger.error(`SendGrid error: ${err.message}`);
      throw err;
    }
  }

  private async sendViaNodemailer(payload: EmailPayload): Promise<void> {
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
}
