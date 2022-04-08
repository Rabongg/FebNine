import {
  Controller,
  Get,
  Query,
  Redirect,
  Render,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Redirect('/foods', 302)
  @Get()
  getFoodPage(): string {
    return;
  }

  @Render('admin')
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminPage(
    @Query('place') place: string,
    @Query('address') address: string,
    @Query('url') url: string,
  ) {
    return { place, address, url };
  }

  @ApiOperation({
    summary: '검색',
    description: '음식점 명칭으로 검색하기',
  })
  @Get('health')
  healthCheck() {
    return 'healthy';
  }
}
