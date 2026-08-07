import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';

export class UpdateRsgeDto {
  prenom?: string; nom?: string; telephone?: string;
  adresse?: string; ville?: string; codePostal?: string;
  noPermis?: string; bureauCoordId?: string; nas?: string;
}

@Injectable()
export class RsgeService {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  async getProfil(id: string) {
    const rsge = await this.prisma.rsge.findUnique({ where: { id }, include: { bureauCoord: true } });
    if (!rsge) throw new NotFoundException();
    const { motDePasse: _, nasChiffre: __, ...safe } = rsge;
    return safe;
  }

  async update(id: string, dto: UpdateRsgeDto) {
    const { nas, ...rest } = dto;
    const data: any = { ...rest };
    if (nas) data.nasChiffre = this.crypto.encrypt(nas);
    return this.prisma.rsge.update({ where: { id }, data });
  }

  async dashboard() {
    const today = new Date(new Date().toDateString());
    const [nbEnfants, nbParents, nbEntentesPending, nbPresencesAuj] = await Promise.all([
      this.prisma.enfant.count({ where: { actif: true } }),
      this.prisma.parent.count(),
      this.prisma.ententeService.count({ where: { statut: 'ENVOYEE_SIGNATURE' } }),
      this.prisma.presence.count({ where: { date: today, statut: 'PRESENT' } }),
    ]);
    return { nbEnfants, nbParents, nbEntentesPending, nbPresencesAuj };
  }
}
