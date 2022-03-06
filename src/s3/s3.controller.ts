import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { S3Service } from './s3.service';

@ApiTags('S3 API')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'content', maxCount: 100 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: 'List of file',
  })
  async uploadFile(
    @UploadedFiles()
    files: {
      thumbnail: Express.Multer.File;
      content: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return this.s3Service.filesUpload(files);
  }
}
