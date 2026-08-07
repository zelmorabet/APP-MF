import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('signatures')
export class SignaturesController {
  constructor(private service: SignaturesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() { return this.service.findAll(); }

  @UseGuards(JwtAuthGuard)
  @Post('entente/:id/envoyer')
  envoyer(@Param('id') id: string) {
    return this.service.envoyerPourSignature(id);
  }

  // Endpoint public pour webhooks Dropbox Sign
  @Post('webhook')
  webhook(@Body() body: any) {
    return this.service.handleWebhook(body);
  }
}
