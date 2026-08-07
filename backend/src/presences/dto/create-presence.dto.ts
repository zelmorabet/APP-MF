import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { StatutPresence } from '@prisma/client';

export class CreatePresenceDto {
  @IsString() enfantId: string;
  @IsDateString() date: string;
  @IsEnum(StatutPresence) statut: StatutPresence;
  @IsOptional() @IsString() heureArrivee?: string;
  @IsOptional() @IsString() heureDepart?: string;
  @IsOptional() @IsString() motifAbsence?: string;
  @IsOptional() @IsString() note?: string;
}

export class BulkPresenceDto {
  @IsDateString() date: string;
  presences: Array<{
    enfantId: string;
    statut: StatutPresence;
    heureArrivee?: string;
    heureDepart?: string;
    note?: string;
  }>;
}
