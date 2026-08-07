import { Module } from '@nestjs/common';
import { RsgeService } from './rsge.service';
import { RsgeController } from './rsge.controller';

@Module({ providers: [RsgeService], controllers: [RsgeController] })
export class RsgeModule {}
