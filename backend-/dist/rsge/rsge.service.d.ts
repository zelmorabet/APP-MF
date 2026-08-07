import { PrismaService } from '../common/prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';
export declare class UpdateRsgeDto {
    prenom?: string;
    nom?: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    noPermis?: string;
    bureauCoordId?: string;
    nas?: string;
}
export declare class RsgeService {
    private prisma;
    private crypto;
    constructor(prisma: PrismaService, crypto: CryptoService);
    getProfil(id: string): Promise<{
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
    update(id: string, dto: UpdateRsgeDto): Promise<{
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
    dashboard(): Promise<{
        nbEnfants: number;
        nbParents: number;
        nbEntentesPending: number;
        nbPresencesAuj: number;
    }>;
}
