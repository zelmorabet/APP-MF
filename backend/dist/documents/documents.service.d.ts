import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { TypeDocument } from '@prisma/client';
export declare class DocumentsService {
    private prisma;
    private config;
    private s3;
    private bucket;
    constructor(prisma: PrismaService, config: ConfigService);
    upload(buffer: Buffer, originalName: string, mimeType: string, type: TypeDocument, parentId?: string, enfantId?: string): Promise<{
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
    getPresignedUrl(documentId: string, expiresIn?: number): Promise<{
        url: string;
    }>;
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
