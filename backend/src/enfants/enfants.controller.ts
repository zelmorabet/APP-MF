import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EnfantsService } from './enfants.service';
import { CreateEnfantDto } from './dto/create-enfant.dto';
import { LierParentDto } from './dto/lier-parent.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('enfants')
export class EnfantsController {
  constructor(private service: EnfantsService) {}

  @Get()
  findAll(@Query('actif') actif?: string) {
    return this.service.findAll(actif !== 'false');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEnfantDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateEnfantDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  desactiver(@Param('id') id: string) {
    return this.service.desactiver(id);
  }

  @Post(':id/parents')
  lierParent(@Param('id') enfantId: string, @Body() dto: LierParentDto) {
    return this.service.lierParent(enfantId, dto.parentId, dto.relation, dto.estCustodial);
  }

  @Delete(':id/parents/:parentId')
  delierParent(@Param('id') enfantId: string, @Param('parentId') parentId: string) {
    return this.service.delierParent(enfantId, parentId);
  }
}
