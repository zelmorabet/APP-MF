import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
export declare class ParentsController {
    private service;
    constructor(service: ParentsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            ententes: number;
            factures: number;
        };
        enfants: ({
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
            enfantId: string;
            parentId: string;
            relation: string;
            estCustodial: boolean;
        })[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        ententes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutEntente;
            enfantId: string;
            parentId: string;
            typeContribution: import(".prisma/client").$Enums.TypeContribution;
            heureArrivee: string | null;
            heureDepart: string | null;
            version: number;
            pdfUrl: string | null;
            signatureReqId: string | null;
            dateDebut: Date;
            dateFin: Date | null;
            horaireType: string | null;
            joursPresence: string | null;
            tarifJournalier: import("@prisma/client-runtime-utils").Decimal;
            dateSignature: Date | null;
        }[];
        enfants: ({
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
            enfantId: string;
            parentId: string;
            relation: string;
            estCustodial: boolean;
        })[];
        factures: {
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
        }[];
    } & {
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
    }>;
    create(dto: CreateParentDto): import(".prisma/client").Prisma.Prisma__ParentClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: Partial<CreateParentDto>): Promise<{
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
    }>;
    delete(id: string): Promise<{
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
    }>;
}
