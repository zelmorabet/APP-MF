import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
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
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
export {};
