import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Render('login')
  @Get()
  showUsersPage() {
    return;
  }

  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @Post('/login')
  login(@Body() userDto: UserDto) {
    return this.usersService.login(userDto);
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
