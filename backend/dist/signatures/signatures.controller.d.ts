import { SignaturesService } from './signatures.service';
export declare class SignaturesController {
    private service;
    constructor(service: SignaturesService);
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
    envoyer(id: string): Promise<{
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
    webhook(body: any): Promise<void>;
}
