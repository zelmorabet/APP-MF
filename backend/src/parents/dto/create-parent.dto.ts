import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { TypeContribution } from '@prisma/client';

export class CreateParentDto {
  @IsEmail() email: string;
  @IsString() prenom: string;
  @IsString() nom: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsString() telephoneTravail?: string;
  @IsOptional() @IsString() adresse?: string;
  @IsOptional() @IsString() ville?: string;
  @IsOptional() @IsString() codePostal?: string;
  @IsEnum(TypeContribution) typeContribution: TypeContribution;
}
