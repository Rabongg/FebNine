import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Site } from '../decorator/site.decorator';

export class CreateFoodDto {
  @IsString()
  @Length(1, 50)
  @ApiProperty({ description: '음식점 이름', example: '알촌' })
  name: string;

  @IsString()
  @ApiProperty({ description: '음식점 설명', example: '약매가 맛있음' })
  description?: string;

  @IsString()
  @ApiProperty({ description: '음식점 위치' })
  @Length(1, 150)
  location: string;

  @Site('http://place.map.kakao.com', {
    message: '잘못된 url입니다.',
  })
  @ApiProperty({ description: '음식점 사이트' })
  @Length(1, 150)
  site: string;

  @IsNumberString({}, { each: true })
  @ApiProperty({ description: '음식점 카테고리' })
  tag: number[];

  @IsNumber()
  @Max(5)
  @Min(1)
  @ApiProperty({ description: '음식점 평점' })
  grade: number;
}
