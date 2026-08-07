import { RsgeService, UpdateRsgeDto } from './rsge.service';
export declare class RsgeController {
    private service;
    constructor(service: RsgeService);
    profil(req: any): Promise<{
        bureauCoord: {
            email: string;
            id: string;
            nom: string;
            telephone: string | null;
            adresse: string | null;
            ville: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        email: string;
        id: string;
        prenom: string;
        nom: string;
        dateNaissance: Date;
        telephone: string | null;
        adresse: string | null;
        ville: string | null;
        codePostal: string | null;
        noPermis: string | null;
        bureauCoordId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    dashboard(): Promise<{
        nbEnfants: number;
        nbParents: number;
        nbEntentesPending: number;
        nbPresencesAuj: number;
    }>;
    update(req: any, dto: UpdateRsgeDto): Promise<{
        email: string;
        motDePasse: string;
        id: string;
        prenom: string;
        nom: string;
        nasChiffre: string;
        dateNaissance: Date;
        telephone: string | null;
        adresse: string | null;
        ville: string | null;
        codePostal: string | null;
        noPermis: string | null;
        bureauCoordId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
