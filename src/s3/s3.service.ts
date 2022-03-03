import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as randomstring from 'randomstring';
import * as sharp from 'sharp';
import * as webpConverter from 'webp-converter';

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

  async filesUpload(files: {
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
    const now = new Date().getTime();
    if (!imageType.includes(thumbnail[0].mimetype))
      throw new BadRequestException('사진이 아닙니다.');
    content.forEach((file) => {
      if (!imageType.includes(file.mimetype))
        throw new BadRequestException('사진이 아닙니다');
    });
    const thumbnailPath = await this.s3Upload(thumbnail[0], 'thumbnail');
    imagePath.push({
      thumbnail: thumbnailPath,
    });
    for (let i = 0; i < content.length; i++) {
      contentPath = await this.s3Upload(content[i], 'content');
      imagePath.push({ content: contentPath });
    }
    console.log(new Date().getTime() - now);
    return imagePath;
  }

  async s3Upload(file, type: string) {
    try {
      const path = await this.s3
        .upload({
          Bucket: `${this.AWS_S3_BUCKET}/food/${type}`,
          Body: await this.convertToWebp(file.buffer, file.originalname),
          Key: `${randomstring.generate()}.webp`,
          ContentType: file.mimetype,
        })
        .promise();
      return path.Location;
    } catch (err) {
      console.log(err);
    }
  }

  async convertToWebp(file: Buffer, fileName: string) {
    try {
      return sharp(file).resize({ width: 100, height: 100 }).toFormat('webp');
    } catch (err) {
      console.log(err);
    }
  }
}
