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
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FindAllFoodQueryDto } from './dto/find-all-food-query.dto';
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';

@ApiTags('음식점 API')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @ApiOperation({
    summary: '음식점 등록',
    description: '음식점 등록',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'content', maxCount: 5 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File;
      content: Express.Multer.File[];
    },
    @Body() createFoodDto: CreateFoodDto,
  ) {
    return this.foodsService.create(files, createFoodDto);
  }

  @ApiOperation({
    summary: '음식점리스트',
    description: '음식점 전체 조회',
  })
  @ApiQuery({ type: FindAllFoodQueryDto })
  @Render('food')
  @Get()
  async findAll(@Query() query: FindAllFoodQueryDto) {
    const { page, limit, category, region, keyword } = query;
    const data = await this.foodsService.findAll(
      category,
      region,
      keyword,
      page,
      limit,
    );
    return { data };
  }

  @ApiOperation({
    summary: '음식점 상세조회',
    description: '음식점 상세조회',
  })
  @Render('detail')
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.foodsService.findOne(id);
    return { data };
  }

  @ApiOperation({
    summary: '음식점 수정',
    description: '음식점 수정',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    return this.foodsService.update(id, updateFoodDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.remove(id);
  }
}
