import {
  Controller,
  Get,
  Query,
  Redirect,
  Render,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Redirect('/foods', 302)
  @Get()
  getFoodPage(): string {
    return;
  }

  @Render('admin')
  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  getAdminPage(
    @Query('place') place: string,
    @Query('address') address: string,
    @Query('url') url: string,
  ) {
    return { place, address, url };
  }
}
