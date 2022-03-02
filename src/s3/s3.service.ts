import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as randomstring from 'randomstring';

@Injectable()
export class S3Service {
  private AWS_S3_BUCKET: string;
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });
    this.AWS_S3_BUCKET = this.configService.get('S3_BUCKET');
  }

  async filesupload(files: {
    thumbnail: Express.Multer.File;
    content: Express.Multer.File[];
  }) {
    let contentPath;
    const { thumbnail, content } = files;
    const imagePath = [];
    const imageType = [
      'image/webp',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
    ];
    if (!imageType.includes(thumbnail[0].mimetype))
      throw new BadRequestException('사진이 아닙니다.');
    content.forEach((file) => {
      if (!imageType.includes(file.mimetype))
        throw new BadRequestException('사진이 아닙니다');
    });
    const thumbnailPath = await this.s3_upload(thumbnail[0], 'thumbnail');
    imagePath.push({
      thumbnail: thumbnailPath,
    });
    for (let i = 0; i < content.length; i++) {
      contentPath = await this.s3_upload(content[i], 'content');
      imagePath.push({ content: contentPath });
    }
    return imagePath;
  }

  async s3_upload(file, type: string) {
    try {
      const path = await this.s3
        .upload({
          Bucket: `${this.AWS_S3_BUCKET}/food/${type}`,
          Body: file.buffer,
          Key: `${randomstring.generate()}.${file.mimetype.split('/')[1]}`,
          ContentType: file.mimetype,
        })
        .promise();
      return path.Location;
    } catch (err) {
      console.log(err);
    }
  }
}
