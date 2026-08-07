import { Controller, Get, Post, Param, Query, Body, Res, UseGuards } from '@nestjs/common';
import { AssiduitesService } from './assiduites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('assiduites')
export class AssiduitesController {
  constructor(private service: AssiduitesService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':annee/:mois')
  findOne(@Param('mois') mois: string, @Param('annee') annee: string) {
    return this.service.findOne(parseInt(mois), parseInt(annee));
  }

  @Post(':annee/:mois/generer')
  generer(@Param('mois') mois: string, @Param('annee') annee: string) {
    return this.service.generer(parseInt(mois), parseInt(annee));
  }

  @Get(':annee/:mois/pdf')
  async telechargerPdf(
    @Param('mois') mois: string,
    @Param('annee') annee: string,
    @Res() res: Response,
  ) {
    const buf = await this.service.genererPdf(parseInt(mois), parseInt(annee));
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="assiduité-${annee}-${mois}.pdf"` });
    res.send(buf);
  }

  @Post(':annee/:mois/envoyer-bc')
  envoyerBC(
    @Param('mois') mois: string,
    @Param('annee') annee: string,
    @Body('emailBC') emailBC: string,
  ) {
    return this.service.envoyerAuBC(parseInt(mois), parseInt(annee), emailBC);
  }
}
