import { IsString, IsDateString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { TypeContribution } from '@prisma/client';

export class CreateEntenteDto {
  @IsString() parentId: string;
  @IsString() enfantId: string;
  @IsDateString() dateDebut: string;
  @IsOptional() @IsDateString() dateFin?: string;
  @IsOptional() @IsString() horaireType?: string;
  @IsOptional() @IsString() joursPresence?: string;
  @IsOptional() @IsString() heureArrivee?: string;
  @IsOptional() @IsString() heureDepart?: string;
  @IsNumber() tarifJournalier: number;
  @IsEnum(TypeContribution) typeContribution: TypeContribution;
}
