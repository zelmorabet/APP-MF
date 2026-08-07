import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CalendrierService } from './calendrier.service';
import { CreateEvenementDto } from './dto/create-evenement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('calendrier')
export class CalendrierController {
  constructor(private service: CalendrierService) {}

  @Get()
  findAll(@Query('debut') debut?: string, @Query('fin') fin?: string) {
    return this.service.findAll(debut ? new Date(debut) : undefined, fin ? new Date(fin) : undefined);
  }

  @Post() create(@Body() dto: CreateEvenementDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateEvenementDto>) { return this.service.update(id, dto); }
  @Delete(':id') delete(@Param('id') id: string) { return this.service.delete(id); }

  @Post('importer-feries')
  importerFeries() { return this.service.importerFeriesQuebec(); }
}
