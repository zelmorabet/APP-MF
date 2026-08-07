import { GroupeAge } from '@prisma/client';
export declare class CreateEnfantDto {
    prenom: string;
    nom: string;
    dateNaissance: string;
    groupeAge: GroupeAge;
    allergies?: string;
    medicaments?: string;
    conditionsMedicales?: string;
    nomMedecin?: string;
    telephoneMedecin?: string;
    nomHopital?: string;
}
