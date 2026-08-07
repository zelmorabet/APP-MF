import { Module } from '@nestjs/common';
import { PresencesService } from './presences.service';
import { PresencesController } from './presences.controller';

@Module({ providers: [PresencesService], controllers: [PresencesController], exports: [PresencesService] })
export class PresencesModule {}
