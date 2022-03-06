import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async findStoreInfo(store: string, page = 1) {
    const key = this.configService.get<string>('KAKAO_REST_API_KEY');
    page = isNaN(page) ? 1 : page;
    const headers = {
      Authorization: `KakaoAK ${key}`,
    };
    try {
      const data = await firstValueFrom(
        this.httpService.get(
          `https://dapi.kakao.com/v2/local/search/keyword?query=${encodeURI(
            store,
          )}&page=${page}`,
          { headers: headers },
        ),
      );
      return data;
    } catch (err) {
      throw new BadRequestException('유효하지 않은 key입니다.');
    }
  }
}
