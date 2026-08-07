import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { RsgeService, UpdateRsgeDto } from './rsge.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rsge')
export class RsgeController {
  constructor(private service: RsgeService) {}

  @Get('profil')
  profil(@Request() req) { return this.service.getProfil(req.user.id); }

  @Get('dashboard')
  dashboard() { return this.service.dashboard(); }

  @Put('profil')
  update(@Request() req, @Body() dto: UpdateRsgeDto) {
    return this.service.update(req.user.id, dto);
  }
}
