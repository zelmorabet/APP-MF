import { Module } from '@nestjs/common';
import { ContactsUrgenceService } from './contacts-urgence.service';
import { ContactsUrgenceController } from './contacts-urgence.controller';

@Module({ providers: [ContactsUrgenceService], controllers: [ContactsUrgenceController] })
export class ContactsUrgenceModule {}
