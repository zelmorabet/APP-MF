import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SignaturesService {
  private readonly logger = new Logger(SignaturesService.name);
  private readonly apiKey: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.apiKey = config.get<string>('DROPBOX_SIGN_API_KEY', '');
  }

  async envoyerPourSignature(ententeId: string) {
    const entente = await this.prisma.ententeService.findUniqueOrThrow({
      where: { id: ententeId },
      include: { parent: true, enfant: true },
    });

    if (!this.apiKey) {
      // Mode développement: simuler l'envoi
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
      const response = await axios.post(
        'https://api.hellosign.com/v3/signature_request/send',
        {
          title: `Entente de services — ${entente.enfant.prenom} ${entente.enfant.nom}`,
          signers: [{ email_address: entente.parent.email, name: `${entente.parent.prenom} ${entente.parent.nom}` }],
          files: [{ name: 'entente.pdf', mime_type: 'application/pdf', file_url: entente.pdfUrl }],
        },
        { auth: { username: this.apiKey, password: '' } },
      );

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
    } catch (err) {
      this.logger.error(`Dropbox Sign error: ${err.message}`);
      throw err;
    }
  }

  // Appelé par webhook Dropbox Sign
  async handleWebhook(event: any) {
    const { event_type, signature_request } = event;
    const dropboxSignId = signature_request?.signature_request_id;
    if (!dropboxSignId) return;

    if (event_type === 'signature_request_signed') {
      await this.prisma.signatureRequete.updateMany({
        where: { dropboxSignId },
        data: { statut: 'SIGNE', dateSignature: new Date() },
      });
      // Mettre à jour l'entente liée
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
}
