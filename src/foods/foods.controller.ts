import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FoodCategoryType } from './entities/food-category.entity';

@ApiTags('음식점 API')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @ApiOperation({
    summary: '음식점 등록',
    description: '음식점 등록',
  })
  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @ApiOperation({
    summary: '음식점리스트',
    description: '음식점 전체 조회',
  })
  @ApiQuery({
    name: 'category',
    enum: FoodCategoryType,
    required: false,
  })
  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('category') category?: FoodCategoryType,
  ) {
    return this.foodsService.findAll(category, page, limit);
  }

  @ApiOperation({
    summary: '음식점 상세조회',
    description: '음식점 상세조회',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.findOne(id);
  }

  @ApiOperation({
    summary: '음식점 수정',
    description: '음식점 수정',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    return this.foodsService.update(id, updateFoodDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.remove(id);
  }
}
