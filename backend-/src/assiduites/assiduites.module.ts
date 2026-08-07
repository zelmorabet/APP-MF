import { Module } from '@nestjs/common';
import { AssiduitesService } from './assiduites.service';
import { AssiduitesController } from './assiduites.controller';

@Module({ providers: [AssiduitesService], controllers: [AssiduitesController] })
export class AssiduitesModule {}
