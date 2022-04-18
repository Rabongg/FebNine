/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FoodCategoryType } from '../enum/food-category.enum';

export class FindAllFoodQueryDto {
  @IsNumber()
  @Min(1)
  @ApiProperty({ description: 'skip 할 숫자' })
  page: number = 1;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'limit 할 숫자' })
  limit: number = 0;

  @IsEnum(FoodCategoryType)
  @IsOptional()
  @ApiProperty({
    type: 'enum',
    default: undefined,
    required: false,
    description: '가게 카테고리',
  })
  category: FoodCategoryType = undefined;
}
