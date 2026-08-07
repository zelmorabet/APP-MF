import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class SignaturesService {
    private prisma;
    private config;
    private readonly logger;
    private readonly apiKey;
    constructor(prisma: PrismaService, config: ConfigService);
    envoyerPourSignature(ententeId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutSignature;
        dateEnvoi: Date;
        dateSignature: Date | null;
        dropboxSignId: string | null;
        signataire: string;
        lienSignature: string | null;
    }>;
    handleWebhook(event: any): Promise<void>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutSignature;
        dateEnvoi: Date;
        dateSignature: Date | null;
        dropboxSignId: string | null;
        signataire: string;
        lienSignature: string | null;
    }[]>;
}
