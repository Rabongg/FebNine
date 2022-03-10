import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: AuthUser) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
