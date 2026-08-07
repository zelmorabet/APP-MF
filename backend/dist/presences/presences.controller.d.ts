import { PresencesService } from './presences.service';
import { CreatePresenceDto, BulkPresenceDto } from './dto/create-presence.dto';
export declare class PresencesController {
    private service;
    constructor(service: PresencesService);
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
    findByMois(mois: string, annee: string): Promise<({
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
    stats(enfantId: string, mois: string, annee: string): Promise<{
        total: number;
        present: number;
        absent: number;
        absentJustifie: number;
        ferie: number;
        fermeture: number;
        mois: number;
        annee: number;
    }>;
    upsert(dto: CreatePresenceDto): Promise<{
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
}
