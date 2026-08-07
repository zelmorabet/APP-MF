import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma/prisma.module';
import { CryptoModule } from './common/crypto/crypto.module';
import { AuthModule } from './auth/auth.module';
import { RsgeModule } from './rsge/rsge.module';
import { EnfantsModule } from './enfants/enfants.module';
import { ParentsModule } from './parents/parents.module';
import { ContactsUrgenceModule } from './contacts-urgence/contacts-urgence.module';
import { PresencesModule } from './presences/presences.module';
import { AssiduitesModule } from './assiduites/assiduites.module';
import { EntentesModule } from './ententes/ententes.module';
import { FacturationModule } from './facturation/facturation.module';
import { RapportsModule } from './rapports/rapports.module';
import { CalendrierModule } from './calendrier/calendrier.module';
import { DocumentsModule } from './documents/documents.module';
import { EmailsModule } from './emails/emails.module';
import { SignaturesModule } from './signatures/signatures.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    CryptoModule,
    AuthModule,
    RsgeModule,
    EnfantsModule,
    ParentsModule,
    ContactsUrgenceModule,
    PresencesModule,
    AssiduitesModule,
    EntentesModule,
    FacturationModule,
    RapportsModule,
    CalendrierModule,
    DocumentsModule,
    EmailsModule,
    SignaturesModule,
  ],
})
export class AppModule {}
