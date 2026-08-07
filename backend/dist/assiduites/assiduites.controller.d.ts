import { AssiduitesService } from './assiduites.service';
import { Response } from 'express';
export declare class AssiduitesController {
    private service;
    constructor(service: AssiduitesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutFeuille;
        annee: number;
        mois: number;
        pdfUrl: string | null;
        dateGeneration: Date | null;
        dateEnvoi: Date | null;
        dateConfirmBC: Date | null;
    }[]>;
    findOne(mois: string, annee: string): import(".prisma/client").Prisma.Prisma__FeuilleAssiduiteClient<({
        presences: ({
            enfant: {
                id: string;
                prenom: string;
                nom: string;
                dateNaissance: Date;
                createdAt: Date;
                updatedAt: Date;
                actif: boolean;
                groupeAge: import(".prisma/client").$Enums.GroupeAge;
                allergies: string | null;
                medicaments: string | null;
                conditionsMedicales: string | null;
                nomMedecin: string | null;
                telephoneMedecin: string | null;
                nomHopital: string | null;
                photoUrl: string | null;
                dateInscription: Date;
                dateDepart: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutPresence;
            date: Date;
            enfantId: string;
            heureArrivee: string | null;
            heureDepart: string | null;
            motifAbsence: string | null;
            note: string | null;
            feuilleId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutFeuille;
        annee: number;
        mois: number;
        pdfUrl: string | null;
        dateGeneration: Date | null;
        dateEnvoi: Date | null;
        dateConfirmBC: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    generer(mois: string, annee: string): Promise<({
        presences: ({
            enfant: {
                id: string;
                prenom: string;
                nom: string;
                dateNaissance: Date;
                createdAt: Date;
                updatedAt: Date;
                actif: boolean;
                groupeAge: import(".prisma/client").$Enums.GroupeAge;
                allergies: string | null;
                medicaments: string | null;
                conditionsMedicales: string | null;
                nomMedecin: string | null;
                telephoneMedecin: string | null;
                nomHopital: string | null;
                photoUrl: string | null;
                dateInscription: Date;
                dateDepart: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutPresence;
            date: Date;
            enfantId: string;
            heureArrivee: string | null;
            heureDepart: string | null;
            motifAbsence: string | null;
            note: string | null;
            feuilleId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        statut: import(".prisma/client").$Enums.StatutFeuille;
        annee: number;
        mois: number;
        pdfUrl: string | null;
        dateGeneration: Date | null;
        dateEnvoi: Date | null;
        dateConfirmBC: Date | null;
    }) | null>;
    telechargerPdf(mois: string, annee: string, res: Response): Promise<void>;
    envoyerBC(mois: string, annee: string, emailBC: string): Promise<{
        message: string;
    }>;
}
