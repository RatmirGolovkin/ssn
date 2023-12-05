import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeLoginDto {
  @IsNotEmpty()
  @IsString()
  oldLogin: string;

  @IsNotEmpty()
  @IsString()
  newLogin: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(26)
  password: string;
}
