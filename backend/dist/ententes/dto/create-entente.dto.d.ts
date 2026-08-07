import { TypeContribution } from '@prisma/client';
export declare class CreateEntenteDto {
    parentId: string;
    enfantId: string;
    dateDebut: string;
    dateFin?: string;
    horaireType?: string;
    joursPresence?: string;
    heureArrivee?: string;
    heureDepart?: string;
    tarifJournalier: number;
    typeContribution: TypeContribution;
}
