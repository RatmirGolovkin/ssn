import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;
}
