import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import multerS3 from 'multer-s3';

@Injectable()
export class S3ImageInterceptor {
  private s3: S3;
  private bucket = 'febnine';

  constructor(private configService: ConfigService) {
    new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    throw new Error('Method not implemented.');
  }

  public upload() {
    return FilesInterceptor('files', 5, {
      storage: multerS3({
        s3: this.s3,
        bucket: this.bucket,
      }),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg' ||
          file.mimetype == 'image/gif' ||
          file.mimetype == 'image/webp'
        )
          cb(null, true);
        else {
          return cb(
            new Error('Only png, jpg, jpeg, gif, webp format is allowed'),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    });
  }
}
