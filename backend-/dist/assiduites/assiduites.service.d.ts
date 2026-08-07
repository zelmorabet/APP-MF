import { PrismaService } from '../common/prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
export declare class AssiduitesService {
    private prisma;
    private emails;
    constructor(prisma: PrismaService, emails: EmailsService);
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
    findOne(mois: number, annee: number): import(".prisma/client").Prisma.Prisma__FeuilleAssiduiteClient<({
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
    generer(mois: number, annee: number): Promise<({
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
    genererPdf(mois: number, annee: number): Promise<Buffer>;
    envoyerAuBC(mois: number, annee: number, emailBC: string): Promise<{
        message: string;
    }>;
}
