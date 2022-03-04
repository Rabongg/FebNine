import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UserDto {
  @IsString()
  @Length(1, 30)
  @ApiProperty({ description: '사용자 이름', example: 'user' })
  username: string;

  @IsString()
  @Length(1, 20)
  @ApiProperty({ description: '사용자 비밀번호', example: 'password' })
  password: string;
}
