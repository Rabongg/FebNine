import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@src/auth/auth.service';

@Controller('users')
@ApiTags('User API')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Render('login')
  @Get()
  showUsersPage() {
    return;
  }

  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Req() req: Record<string, any>) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입',
  })
  @Post()
  createUser(@Body() userDto: UserDto) {
    this.usersService.createUser(userDto);
  }
}
