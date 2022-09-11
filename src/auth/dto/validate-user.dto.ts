import { IsNumber, IsString, Min } from 'class-validator';

export class ValidateUserDto {
  @IsNumber()
  @Min(1)
  id: number;

  @IsString()
  username: string;
}
