import { EnfantsService } from './enfants.service';
import { CreateEnfantDto } from './dto/create-enfant.dto';
export declare class EnfantsController {
    private service;
    constructor(service: EnfantsService);
    findAll(actif?: string): import(".prisma/client").Prisma.PrismaPromise<({
        contactUrgence: {
            id: string;
            prenom: string;
            nom: string;
            enfantId: string;
            relation: string;
            telephone1: string;
            telephone2: string | null;
            autoriseDepart: boolean;
        } | null;
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
    })[]>;
    findOne(id: string): Promise<{
        contactUrgence: {
            id: string;
            prenom: string;
            nom: string;
            enfantId: string;
            relation: string;
            telephone1: string;
            telephone2: string | null;
            autoriseDepart: boolean;
        } | null;
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
        presences: {
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
        }[];
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
    }>;
    create(dto: CreateEnfantDto): Promise<{
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
    }>;
    update(id: string, dto: Partial<CreateEnfantDto>): Promise<{
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
    }>;
    desactiver(id: string): Promise<{
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
    }>;
    lierParent(enfantId: string, body: {
        parentId: string;
        relation: string;
        estCustodial?: boolean;
    }): Promise<{
        enfantId: string;
        parentId: string;
        relation: string;
        estCustodial: boolean;
    }>;
    delierParent(enfantId: string, parentId: string): Promise<{
        enfantId: string;
        parentId: string;
        relation: string;
        estCustodial: boolean;
    }>;
}
