import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  @Length(1, 50)
  @ApiProperty({ description: '음식점 이름', example: '알촌' })
  name: string;

  @IsString()
  @ApiProperty({ description: '음식점 설명', example: '약매가 맛있음' })
  description: string;

  @IsString()
  @ApiProperty({ description: '음식점 위치' })
  @Length(1, 150)
  location: string;

  @IsUrl()
  @ApiProperty({ description: '음식점 사이트' })
  @Length(1, 150)
  site: string;

  @IsNumber({}, { each: true })
  @ApiProperty({ description: '음식점 카테고리' })
  tag: number[];
}
