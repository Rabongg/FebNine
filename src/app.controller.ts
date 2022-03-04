import { Controller, Get, Query, Render, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('food')
  @Get()
  getFoodPage(): string {
    return;
  }

  @Render('admin')
  @Get('admin')
  getAdminPage(
    @Query('place') place: string,
    @Query('address') address: string,
    @Query('url') url: string,
  ) {
    return { place, address, url };
  }
}
