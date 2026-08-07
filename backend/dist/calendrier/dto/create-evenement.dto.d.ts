import { TypeEvenement } from '@prisma/client';
export declare class CreateEvenementDto {
    titre: string;
    type: TypeEvenement;
    dateDebut: string;
    dateFin?: string;
    touteJournee: boolean;
    description?: string;
    couleur?: string;
}
