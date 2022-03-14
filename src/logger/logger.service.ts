import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { createLogger, transports, Logger, format } from 'winston';
import * as moment from 'moment';

@Injectable()
export class MyLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.colorize({
          all: true,
          colors: {
            info: 'blue',
            error: 'red',
            debug: 'green',
          },
        }),
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf((i) => `[${i.level}]:${[i.timestamp]}:${i.message}`),
      ),
      transports: [
        new transports.File({
          level: 'error',
          filename: `error(${moment(new Date()).format('YYYY.MM.DD')}).log`,
          dirname: 'logs',
          maxsize: 5 * 1000 * 1000,
          silent: process.env.NODE_ENV !== 'production',
        }),
        new transports.Console({
          level: 'debug',
          silent: process.env.NODE_ENV === 'production',
        }),
        new transports.File({
          level: 'info',
          filename: `application(${moment(new Date()).format(
            'YYYY.MM.DD',
          )}).log`,
          dirname: 'logs',
          maxsize: 5 * 1000 * 1000,
          silent: process.env.NODE_ENV !== 'production',
          format: format.combine(
            format.printf((i) =>
              i.level === 'info'
                ? `${i.level}: ${i.timestamp} ${i.message}`
                : '',
            ),
          ),
        }),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    if (process.env.NODE_ENV === 'production') this.logger.info(message);
    else this.logger.debug(message);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message);
  }
}
