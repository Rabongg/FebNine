import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(private httpService: HttpService) {}

  async findStoreInfo(store: string) {
    const key = process.env.KAKAO_REST_API_KEY;
    const headers = {
      Authorization: `KakaoAK ${key}`,
    };
    return firstValueFrom(
      this.httpService.get(
        `https://dapi.kakao.com/v2/local/search/keyword?query=${encodeURI(
          store,
        )}`,
        { headers: headers },
      ),
    );
  }
}
