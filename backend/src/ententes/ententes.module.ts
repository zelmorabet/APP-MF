import { Module } from '@nestjs/common';
import { SignaturesModule } from '../signatures/signatures.module';
import { EntentesService } from './ententes.service';
import { EntentesController } from './ententes.controller';

@Module({
  imports: [SignaturesModule],
  providers: [EntentesService],
  controllers: [EntentesController],
})
export class EntentesModule {}
