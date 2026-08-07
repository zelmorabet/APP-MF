import {
  IsString, IsEmail, IsOptional, IsDateString,
  IsEnum, IsDecimal, IsArray, IsBoolean,
} from 'class-validator';
import { GroupeAge } from '@prisma/client';

export class CreateEnfantDto {
  @IsString() prenom: string;
  @IsString() nom: string;
  @IsDateString() dateNaissance: string;
  @IsEnum(GroupeAge) groupeAge: GroupeAge;
  @IsOptional() @IsString() allergies?: string;
  @IsOptional() @IsString() medicaments?: string;
  @IsOptional() @IsString() conditionsMedicales?: string;
  @IsOptional() @IsString() nomMedecin?: string;
  @IsOptional() @IsString() telephoneMedecin?: string;
  @IsOptional() @IsString() nomHopital?: string;
}
