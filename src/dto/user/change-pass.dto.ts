import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(26)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(26)
  newPassword: string;
}
