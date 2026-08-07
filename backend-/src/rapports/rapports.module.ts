import { Module } from '@nestjs/common';
import { RapportsService } from './rapports.service';
import { RapportsController } from './rapports.controller';

@Module({ providers: [RapportsService], controllers: [RapportsController] })
export class RapportsModule {}
