import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeDescriptionChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;
}
