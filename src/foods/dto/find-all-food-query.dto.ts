import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FoodCategoryType } from '../enum/food-category.enum';

export class FindAllFoodQueryDto {
  @IsNumber()
  @ApiProperty({ default: 1, required: false, description: 'skip 할 숫자' })
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @ApiProperty({ default: 10, required: false, description: 'limit 할 숫자' })
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @IsEnum(FoodCategoryType)
  @IsOptional()
  @ApiProperty({
    type: 'enum',
    default: undefined,
    required: false,
    description: '가게 카테고리',
  })
  category?: FoodCategoryType;
}
