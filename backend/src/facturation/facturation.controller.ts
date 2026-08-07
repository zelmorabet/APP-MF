import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { FacturationService } from './facturation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('facturation')
export class FacturationController {
  constructor(private service: FacturationService) {}

  @Get()
  findAll(@Query('annee') annee?: string) {
    return this.service.findAll(annee ? parseInt(annee) : undefined);
  }

  @Get('parent/:parentId')
  findByParent(@Param('parentId') id: string) {
    return this.service.findByParent(id);
  }

  @Get('tableau-de-bord/:annee')
  tableauDeBord(@Param('annee') annee: string) {
    return this.service.tableauDeBord(parseInt(annee));
  }

  @Post('generer/:annee/:mois')
  generer(@Param('mois') mois: string, @Param('annee') annee: string) {
    return this.service.genererFacturesMois(parseInt(mois), parseInt(annee));
  }

  @Post(':id/envoyer')
  envoyer(@Param('id') id: string) {
    return this.service.envoyerFacture(id);
  }
}
