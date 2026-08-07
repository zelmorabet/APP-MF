import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailsService } from '../emails/emails.service';
import { SignaturesService } from '../signatures/signatures.service';
import { CreateEntenteDto } from './dto/create-entente.dto';
@Injectable()
export class EntentesService {
  constructor(
    private prisma: PrismaService,
    private emails: EmailsService,
    private signatures: SignaturesService,
  ) {}

  findAll() {
    return this.prisma.ententeService.findMany({
      include: { parent: true, enfant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const e = await this.prisma.ententeService.findUnique({
      where: { id },
      include: { parent: true, enfant: true, signatureRequete: true },
    });
    if (!e) throw new NotFoundException();
    return e;
  }

  create(dto: CreateEntenteDto) {
    return this.prisma.ententeService.create({
      data: {
        ...dto,
        dateDebut: new Date(dto.dateDebut),
        dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
        tarifJournalier: dto.tarifJournalier,
      },
      include: { parent: true, enfant: true },
    });
  }

  async update(id: string, dto: Partial<CreateEntenteDto>) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.dateDebut) data.dateDebut = new Date(dto.dateDebut);
    if (dto.dateFin) data.dateFin = new Date(dto.dateFin);
    return this.prisma.ententeService.update({ where: { id }, data });
  }

  async envoyerPourSignature(id: string) {
    return this.signatures.envoyerPourSignature(id);
  }

  findByParent(parentId: string) {
    return this.prisma.ententeService.findMany({
      where: { parentId },
      include: { enfant: true, signatureRequete: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByEnfant(enfantId: string) {
    return this.prisma.ententeService.findMany({
      where: { enfantId },
      include: { parent: true, signatureRequete: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
