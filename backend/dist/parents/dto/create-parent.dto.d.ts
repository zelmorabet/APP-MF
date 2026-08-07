import { TypeContribution } from '@prisma/client';
export declare class CreateParentDto {
    email: string;
    prenom: string;
    nom: string;
    telephone?: string;
    telephoneTravail?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    typeContribution: TypeContribution;
}
