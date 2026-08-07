import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        profile: {
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
        };
    }>;
    changePassword(rsgeId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
