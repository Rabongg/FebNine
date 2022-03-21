import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as randomstring from 'randomstring';
import * as sharp from 'sharp';
import * as webpConverter from 'webp-converter';
import { FileImageType } from './enum/file-image.enum';

@Injectable()
export class S3Service {
  private AWS_S3_BUCKET: string;
  private s3: S3;
  private url: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });
    this.AWS_S3_BUCKET = this.configService.get('S3_BUCKET');
    this.url = this.configService.get('S3_URL');
  }

  async filesUpload(files: {
    thumbnail: Express.Multer.File;
    content: Express.Multer.File[];
  }) {
    let contentPath: string;
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
    const thumbnailPath = await this.s3Upload(
      thumbnail[0],
      FileImageType.thumbnail,
    );
    imagePath.push({
      thumbnail: `${this.url}/${thumbnailPath}`,
    });
    for (let i = 0; i < content.length; i++) {
      contentPath = await this.s3Upload(content[i], FileImageType.content);
      imagePath.push({ content: `${this.url}/${contentPath}` });
    }
    return imagePath;
  }

  async s3Upload(file: any, type: FileImageType) {
    try {
      const path = await this.s3
        .upload({
          Bucket: `${this.AWS_S3_BUCKET}/food/${type}`,
          // Body: file.buffer,
          Body: await this.convertToWebp(file.buffer, type),
          Key: `${randomstring.generate()}.avif`,
          ContentType: `avif`,
        })
        .promise();
      return path.Key;
    } catch (err) {
      console.log(err);
    }
  }

  async convertToWebp(file: Buffer, type: FileImageType) {
    try {
      if (type == FileImageType.content) {
        return sharp(file).rotate().avif({ quality: 40 }).toBuffer();
      } else {
        // return sharp(file).resize({ width: 100, height: 100 }).withMetadata();
        return sharp(file).rotate().avif({ quality: 40 }).toBuffer();
        // .toFormat('webp');
      }
    } catch (err) {
      console.log(err);
    }
  }
}
