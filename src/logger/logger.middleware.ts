import { Injectable, NestMiddleware } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tempUrl = req.method + ' ' + req.url.split('?')[0];
    const headers = JSON.stringify(req.headers ? req.headers : {});
    const query = JSON.stringify(req.query ? req.query : {});
    const body = JSON.stringify(req.body ? req.body : {});
    const url = JSON.stringify(tempUrl ? tempUrl : {});
    this.loggerService.log(
      `${url} ${headers} ${query} ${body}`.replace(/\\/, ''),
    );
    next();
  }
}
