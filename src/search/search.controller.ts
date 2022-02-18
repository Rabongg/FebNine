import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('search')
@ApiTags('검색 API')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @ApiOperation({
    summary: '검색',
    description: '음식점 명칭으로 검색하기',
  })
  @Get('')
  findAll(@Query('store') store: string) {
    return this.searchService.findStoreInfo(store);
  }
}
