import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FoodCategoryType } from '../enum/food-category.enum';

export class FindAllFoodQueryDto {
  @IsNumber()
  @ApiProperty({ description: 'skip 할 숫자' })
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsNumber()
  @ApiProperty({ description: 'limit 할 숫자' })
  @Min(0)
  @Type(() => Number)
  limit: number;

  @IsEnum(FoodCategoryType)
  @IsOptional()
  @ApiProperty({ description: '가게 카테고리' })
  category?: FoodCategoryType;
}
