import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { EntentesService } from './ententes.service';
import { CreateEntenteDto } from './dto/create-entente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ententes')
export class EntentesController {
  constructor(private service: EntentesService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Get('parent/:parentId') findByParent(@Param('parentId') id: string) { return this.service.findByParent(id); }
  @Get('enfant/:enfantId') findByEnfant(@Param('enfantId') id: string) { return this.service.findByEnfant(id); }
  @Post() create(@Body() dto: CreateEntenteDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateEntenteDto>) { return this.service.update(id, dto); }

  @Post(':id/envoyer-signature')
  envoyerSignature(@Param('id') id: string) {
    return this.service.envoyerPourSignature(id);
  }
}
