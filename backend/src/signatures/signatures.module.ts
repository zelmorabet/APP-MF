import { Module } from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { SignaturesController } from './signatures.controller';

@Module({ providers: [SignaturesService], controllers: [SignaturesController], exports: [SignaturesService] })
export class SignaturesModule {}
