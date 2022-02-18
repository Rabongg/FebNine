import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ConfigService } from '@nestjs/config';
import { map, firstValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async findStoreInfo(store: string) {
    const key = this.configService.get<string>('KAKAO_REST_API_KEY');
    const headers = {
      Authorization: `KakaoAK ${key}`,
    };
    return this.httpService
      .get(
        `https://dapi.kakao.com/v2/local/search/keyword?query=${encodeURI(
          store,
        )}`,
        { headers: headers },
      )
      .pipe(map((res) => res.data));
  }
}
