/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FoodCategoryType } from '../enum/food-category.enum';
import { FoodRegionType } from '../enum/food-region.enum';

export class FindAllFoodQueryDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'skip 할 숫자' })
  page: number = 1;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'limit 할 숫자' })
  limit: number = 0;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '키워드' })
  keyword: string = undefined;

  @IsEnum(FoodCategoryType)
  @IsOptional()
  @ApiProperty({
    type: 'enum',
    default: undefined,
    required: false,
    description: '가게 카테고리',
  })
  category: FoodCategoryType = undefined;

  @IsEnum(FoodRegionType)
  @IsOptional()
  @ApiProperty({
    type: 'enum',
    default: undefined,
    required: false,
    description: '가게 지역',
  })
  region: FoodRegionType = undefined;
}
