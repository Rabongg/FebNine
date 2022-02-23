import { Controller, Get, Query, Render, Version } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('search')
@ApiTags('검색 API')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @ApiOperation({
    summary: '검색',
    description: '음식점 명칭으로 검색하기',
  })
  @Render('result')
  @Get('result')
  async findStore(@Query('store') store: string) {
    const data = await this.searchService.findStoreInfo(store);
    return { data: data.data['documents'], keyword: store };
  }

  @Render('search')
  @Get()
  showFindPage() {
    return;
  }

  @Render('result')
  @Get('result')
  showResultofSearch() {
    return;
  }
}
