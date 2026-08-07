import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContactsUrgenceService } from './contacts-urgence.service';
import { CreateContactUrgenceDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('contacts-urgence')
export class ContactsUrgenceController {
  constructor(private service: ContactsUrgenceService) {}

  @Get('enfant/:enfantId')
  findByEnfant(@Param('enfantId') enfantId: string) {
    return this.service.findByEnfant(enfantId);
  }

  @Post() create(@Body() dto: CreateContactUrgenceDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateContactUrgenceDto>) { return this.service.update(id, dto); }
  @Delete(':id') delete(@Param('id') id: string) { return this.service.delete(id); }
}
