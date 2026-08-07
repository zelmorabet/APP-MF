import { RapportsService } from './rapports.service';
export declare class RapportsController {
    private service;
    constructor(service: RapportsService);
    assiduites(mois: string, annee: string): Promise<{
        mois: number;
        annee: number;
        periode: string;
        lignes: {
            enfant: string;
            groupeAge: import(".prisma/client").$Enums.GroupeAge;
            presents: number;
            absents: number;
            feries: number;
            fermetures: number;
        }[];
    }>;
    inscriptions(): Promise<{
        total: number;
        actifs: number;
        enfants: ({
            parents: ({
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
            } & {
                enfantId: string;
                parentId: string;
                relation: string;
                estCustodial: boolean;
            })[];
        } & {
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
        })[];
    }>;
    fermetures(annee: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateDebut: Date;
        dateFin: Date | null;
        titre: string;
        type: import(".prisma/client").$Enums.TypeEvenement;
        touteJournee: boolean;
        description: string | null;
        couleur: string | null;
    }[]>;
    facturation(annee: string): Promise<{
        annee: number;
        factures: ({
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
        })[];
        resume: {
            totalBrut: number;
            totalSubvention: number;
            totalNet: number;
        };
    }>;
    envoyerBC(mois: string, annee: string, emailBC: string): Promise<{
        message: string;
    }>;
}
