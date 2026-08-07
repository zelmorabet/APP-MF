import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const rsge = await this.prisma.rsge.findUnique({ where: { email: dto.email } });
    if (!rsge) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(dto.motDePasse, rsge.motDePasse);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const payload = { sub: rsge.id, email: rsge.email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '8h'),
    });

    const { motDePasse: _, nasChiffre: __, ...profile } = rsge;
    return { accessToken, profile };
  }

  async changePassword(rsgeId: string, currentPassword: string, newPassword: string) {
    const rsge = await this.prisma.rsge.findUniqueOrThrow({ where: { id: rsgeId } });
    const valid = await bcrypt.compare(currentPassword, rsge.motDePasse);
    if (!valid) throw new UnauthorizedException('Mot de passe actuel incorrect');

    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.rsge.update({ where: { id: rsgeId }, data: { motDePasse: hash } });
    return { message: 'Mot de passe modifié avec succès' };
  }
}
