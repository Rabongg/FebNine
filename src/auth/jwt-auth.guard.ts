import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request?.headers?.cookie) {
      const data = request.headers.cookie.split('; ');
      data.forEach((values: string) => {
        if (values.split('=')[0] === 'febnine')
          request.headers.authorization = `Bearer ${values.split('=')[1]}`;
      });
    }
    return super.canActivate(context);
  }
}
