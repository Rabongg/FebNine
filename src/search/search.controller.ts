import { Controller, Get, ParseIntPipe, Query, Render } from '@nestjs/common';
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
  async findStore(@Query('store') store: string, @Query('page') page: number) {
    const data = await this.searchService.findStoreInfo(store, page);
    const pages = Math.ceil(parseInt(data.data['meta'].pageable_count) / 15);
    return {
      data: data.data['documents'],
      keyword: store,
      count: data.data['meta'].pageable_count,
      page: pages,
    };
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
