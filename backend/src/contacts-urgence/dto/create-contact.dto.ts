import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateContactUrgenceDto {
  @IsString() enfantId: string;
  @IsString() prenom: string;
  @IsString() nom: string;
  @IsString() relation: string;
  @IsString() telephone1: string;
  @IsOptional() @IsString() telephone2?: string;
  @IsBoolean() autoriseDepart: boolean;
}
