import { StatutPresence } from '@prisma/client';
export declare class CreatePresenceDto {
    enfantId: string;
    date: string;
    statut: StatutPresence;
    heureArrivee?: string;
    heureDepart?: string;
    motifAbsence?: string;
    note?: string;
}
export declare class BulkPresenceDto {
    date: string;
    presences: Array<{
        enfantId: string;
        statut: StatutPresence;
        heureArrivee?: string;
        heureDepart?: string;
        note?: string;
    }>;
}
