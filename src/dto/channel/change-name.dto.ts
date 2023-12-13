import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeNameChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;
}
