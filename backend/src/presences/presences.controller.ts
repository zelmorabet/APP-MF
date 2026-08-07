import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PresencesService } from './presences.service';
import { CreatePresenceDto, BulkPresenceDto } from './dto/create-presence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('presences')
export class PresencesController {
  constructor(private service: PresencesService) {}

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.service.findByDate(date);
  }

  @Get('mois')
  findByMois(@Query('mois') mois: string, @Query('annee') annee: string) {
    return this.service.findByMois(parseInt(mois), parseInt(annee));
  }

  @Get('stats/:enfantId')
  stats(
    @Param('enfantId') enfantId: string,
    @Query('mois') mois: string,
    @Query('annee') annee: string,
  ) {
    return this.service.statsEnfant(enfantId, parseInt(mois), parseInt(annee));
  }

  @Post()
  upsert(@Body() dto: CreatePresenceDto) {
    return this.service.upsertPresence(dto);
  }

  @Post('bulk')
  saisieGroupee(@Body() dto: BulkPresenceDto) {
    return this.service.saisieGroupee(dto);
  }
}
