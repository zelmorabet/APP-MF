import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePresenceDto, BulkPresenceDto } from './dto/create-presence.dto';
export declare class PresencesService {
    private prisma;
    constructor(prisma: PrismaService);
    findByDate(date: string): Promise<({
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
    findByMois(mois: number, annee: number): Promise<({
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
    })[]>;
    upsertPresence(dto: CreatePresenceDto): Promise<{
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
    }>;
    saisieGroupee(dto: BulkPresenceDto): Promise<{
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
    }[]>;
    statsEnfant(enfantId: string, mois: number, annee: number): Promise<{
        total: number;
        present: number;
        absent: number;
        absentJustifie: number;
        ferie: number;
        fermeture: number;
        mois: number;
        annee: number;
    }>;
}
