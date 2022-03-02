import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  thumbnail: any;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  content: any[];
}
