import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async findStoreInfo(store: string, page = 1) {
    const key = this.configService.get<string>('KAKAO_REST_API_KEY');
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
      throw new UnauthorizedException('유효하지 않은 key입니다.');
    }
  }
}
