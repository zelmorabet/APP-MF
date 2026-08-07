import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
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
}
export {};
