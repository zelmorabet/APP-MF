import { Module } from '@nestjs/common';
import { EnfantsService } from './enfants.service';
import { EnfantsController } from './enfants.controller';

@Module({ providers: [EnfantsService], controllers: [EnfantsController], exports: [EnfantsService] })
export class EnfantsModule {}
