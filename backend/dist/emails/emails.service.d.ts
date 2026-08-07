import { ConfigService } from '@nestjs/config';
export interface EmailPayload {
    to: string;
    toName?: string;
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
        type: string;
    }>;
}
export declare class EmailsService {
    private config;
    private readonly logger;
    private readonly useSendGrid;
    constructor(config: ConfigService);
    send(payload: EmailPayload): Promise<void>;
    envoyerDocument(to: string, toName: string, nomDoc: string, pdfBuffer: Buffer): Promise<void>;
    envoyerDemandeSignature(to: string, toName: string, lienSignature: string, nomDoc: string): Promise<void>;
    envoyerFicheAssiduité(to: string, toName: string, mois: string, pdfBuffer: Buffer): Promise<void>;
    private sendViaSendGrid;
    private sendViaNodemailer;
}
