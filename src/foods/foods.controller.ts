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
  Render,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FindAllFoodQueryDto } from './dto/find-all-food-query.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FoodCategoryType } from './enum/food-category.enum';

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
  @ApiQuery({ type: FindAllFoodQueryDto })
  @Render('food')
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 5,
    @Query('category') category = undefined,
  ) {
    const data = await this.foodsService.findAll(category, page, limit);
    return { data };
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
