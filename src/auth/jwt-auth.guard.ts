import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request?.headers?.cookie)
      request.headers.authorization = `Bearer ${
        request.headers.cookie.split('=')[1]
      }`;
    return super.canActivate(context);
  }
}
