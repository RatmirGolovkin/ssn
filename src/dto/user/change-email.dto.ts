import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  oldEmail: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  newEmail: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(26)
  password: string;
}
