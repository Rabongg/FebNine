import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Hash } from '../utils/hash';
import { ValidateUserDto } from '@src/auth/dto/validate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDto: UserDto): Promise<number> {
    try {
      const { username, password } = userDto;
      const encryptPassword = await Hash.encrypt(password);
      const user: User = await this.userRepository.save({
        username,
        password: encryptPassword,
      });
      return user.id;
    } catch (err) {
      throw new ConflictException('문제가 발생했습니다.');
    }
  }

  async validateUser(userDto: UserDto): Promise<ValidateUserDto> {
    try {
      const { username, password } = userDto;
      const user = await this.userRepository.findOne({ username });
      if (user) {
        const isValid = await Hash.validate(user.password, password);
        if (isValid) {
          return { username: user.username, id: user.id };
        }
        throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요');
      }
    } catch (err) {
      throw new UnauthorizedException('아이디와 비밀번호를 확인해주세요');
    }
  }
}
