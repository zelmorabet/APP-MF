import { IsString, IsEnum, IsDateString, IsBoolean, IsOptional } from 'class-validator';
import { TypeEvenement } from '@prisma/client';

export class CreateEvenementDto {
  @IsString() titre: string;
  @IsEnum(TypeEvenement) type: TypeEvenement;
  @IsDateString() dateDebut: string;
  @IsOptional() @IsDateString() dateFin?: string;
  @IsBoolean() touteJournee: boolean;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() couleur?: string;
}
