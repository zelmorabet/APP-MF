import { Module } from '@nestjs/common';
import { FacturationService } from './facturation.service';
import { FacturationController } from './facturation.controller';

@Module({ providers: [FacturationService], controllers: [FacturationController] })
export class FacturationModule {}
