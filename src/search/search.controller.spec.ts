import { HttpModule, HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let searchController: SearchController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();

    searchController = module.get<SearchController>(SearchController);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('findStore', () => {
    it('should return an store info when key is correct', async () => {
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
      expect(await searchController.findStore('꿉당', 1)).toStrictEqual({
        data: data.data.documents,
        keyword: '꿉당',
      });
    });

    it('should return error when key is wrong', async () => {
      try {
        await searchController.findStore('꿉당', 1);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('유효하지 않은 key입니다.');
      }
    });
  });
});
