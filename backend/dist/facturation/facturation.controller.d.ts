import { FacturationService } from './facturation.service';
export declare class FacturationController {
    private service;
    constructor(service: FacturationService);
    findAll(annee?: string): import(".prisma/client").Prisma.PrismaPromise<({
        parent: {
            email: string;
            id: string;
            prenom: string;
            nom: string;
            telephone: string | null;
            adresse: string | null;
            ville: string | null;
            codePostal: string | null;
            createdAt: Date;
            updatedAt: Date;
            telephoneTravail: string | null;
            typeContribution: import(".prisma/client").$Enums.TypeContribution;
        };
        subventions: {
            id: string;
            type: string;
            factureId: string;
            montant: import("@prisma/client-runtime-utils").Decimal;
            reference: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutFacture;
        parentId: string;
        annee: number;
        mois: number;
        pdfUrl: string | null;
        dateEnvoi: Date | null;
        tarifJournalier: import("@prisma/client-runtime-utils").Decimal;
        nombreJours: number;
        montantBrut: import("@prisma/client-runtime-utils").Decimal;
        montantSubvention: import("@prisma/client-runtime-utils").Decimal;
        montantNet: import("@prisma/client-runtime-utils").Decimal;
        datePaiement: Date | null;
    })[]>;
    findByParent(id: string): import(".prisma/client").Prisma.PrismaPromise<({
        subventions: {
            id: string;
            type: string;
            factureId: string;
            montant: import("@prisma/client-runtime-utils").Decimal;
            reference: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutFacture;
        parentId: string;
        annee: number;
        mois: number;
        pdfUrl: string | null;
        dateEnvoi: Date | null;
        tarifJournalier: import("@prisma/client-runtime-utils").Decimal;
        nombreJours: number;
        montantBrut: import("@prisma/client-runtime-utils").Decimal;
        montantSubvention: import("@prisma/client-runtime-utils").Decimal;
        montantNet: import("@prisma/client-runtime-utils").Decimal;
        datePaiement: Date | null;
    })[]>;
    tableauDeBord(annee: string): Promise<{
        annee: number;
        totalBrut: number;
        totalSubvention: number;
        totalNet: number;
        nbFactures: number;
    }>;
    generer(mois: string, annee: string): Promise<any[]>;
    envoyer(id: string): Promise<{
        message: string;
    }>;
}
