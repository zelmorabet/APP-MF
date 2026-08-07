import { DocumentsService } from './documents.service';
import { TypeDocument } from '@prisma/client';
export declare class DocumentsController {
    private service;
    constructor(service: DocumentsService);
    findAll(parentId?: string, enfantId?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        nom: string;
        createdAt: Date;
        enfantId: string | null;
        parentId: string | null;
        url: string;
        dateEnvoi: Date | null;
        signatureReqId: string | null;
        type: import(".prisma/client").$Enums.TypeDocument;
        taille: number | null;
        estSigne: boolean;
    }[]>;
    getUrl(id: string): Promise<{
        url: string;
    }>;
    upload(file: Express.Multer.File, type: TypeDocument, parentId?: string, enfantId?: string): Promise<{
        id: string;
        nom: string;
        createdAt: Date;
        enfantId: string | null;
        parentId: string | null;
        url: string;
        dateEnvoi: Date | null;
        signatureReqId: string | null;
        type: import(".prisma/client").$Enums.TypeDocument;
        taille: number | null;
        estSigne: boolean;
    }>;
    delete(id: string): Promise<{
        id: string;
        nom: string;
        createdAt: Date;
        enfantId: string | null;
        parentId: string | null;
        url: string;
        dateEnvoi: Date | null;
        signatureReqId: string | null;
        type: import(".prisma/client").$Enums.TypeDocument;
        taille: number | null;
        estSigne: boolean;
    }>;
}
