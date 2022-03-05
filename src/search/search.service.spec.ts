import { HttpModule, HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  it('should be return data if key is correct', async () => {
    const data = {
      data: {
        documents: [
          {
            address_name: '서울특별시 강남구 삼성동',
            distance: 0,
            id: '1',
            place_name: '삼성제과의원',
            road_address_name: '삼성로',
            x: '127.03788',
            y: '37.502424',
          },
        ],
      },
    };
    httpService.get = jest.fn().mockImplementationOnce(() => {
      return of(data);
    });
    expect(await service.findStoreInfo('꿉당')).toStrictEqual(data);
  });

  it('should be return error if key is wrong', async () => {
    try {
      httpService.get = jest.fn().mockRejectedValue(new Error());
      await service.findStoreInfo('꿉당');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('유효하지 않은 key입니다.');
    }
  });
});
