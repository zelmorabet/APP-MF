import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RapportsService } from './rapports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rapports')
export class RapportsController {
  constructor(private service: RapportsService) {}

  @Get('assiduites/:annee/:mois')
  assiduites(@Param('mois') mois: string, @Param('annee') annee: string) {
    return this.service.rapportAssiduiteMensuel(parseInt(mois), parseInt(annee));
  }

  @Get('inscriptions')
  inscriptions() { return this.service.rapportInscriptions(); }

  @Get('fermetures/:annee')
  fermetures(@Param('annee') annee: string) {
    return this.service.rapportFermetures(parseInt(annee));
  }

  @Get('facturation/:annee')
  facturation(@Param('annee') annee: string) {
    return this.service.rapportFacturationAnnuelle(parseInt(annee));
  }

  @Post('assiduites/:annee/:mois/envoyer-bc')
  envoyerBC(
    @Param('mois') mois: string,
    @Param('annee') annee: string,
    @Body('emailBC') emailBC: string,
  ) {
    return this.service.envoyerRapportBC(parseInt(mois), parseInt(annee), emailBC);
  }
}
