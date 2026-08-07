import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Adresse courriel invalide' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  motDePasse: string;
}
