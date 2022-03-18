import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getRepositoryToken } from '@nestjs/typeorm';
import { S3Module } from '@src/s3/s3.module';
import { S3Service } from '@src/s3/s3.service';
import { Connection, Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { Food } from './entities/food.entity';
import { FoodCategoryType } from './enum/food-category.enum';
import { FoodsService } from './foods.service';
import { Category } from './interfaces/category.interface';
import { FoodStore } from './interfaces/food-store.interface';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockConnection = Partial<Record<keyof Connection, jest.Mock>>;

const MockFoodRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    execute: jest.fn(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  }),
  save: jest.fn(),
});

const MockConnection = () => ({
  createQueryRunner: jest.fn().mockReturnValue({
    query: jest.fn(),
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      update: jest.fn().mockResolvedValue({}),
    },
  }),
});

describe('FoodsService', () => {
  let service: FoodsService;
  let s3Service: S3Service;
  let foodRepository: MockRepository<Food>;
  let connection: MockConnection;
  let connection1: MockConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [S3Module, ConfigModule],
      providers: [
        FoodsService,
        {
          provide: getRepositoryToken(Food),
          useValue: MockFoodRepository(),
        },
        {
          provide: getConnectionToken(),
          useValue: MockConnection(),
        },
        S3Service,
      ],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
    s3Service = module.get<S3Service>(S3Service);
    foodRepository = module.get<MockRepository<Food>>(getRepositoryToken(Food));
    connection = module.get<MockConnection>(getConnectionToken());
    connection1 = module.get<MockConnection>(getConnectionToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(foodRepository).toBeDefined();
    expect(s3Service).toBeDefined();
    expect(connection).toBeDefined();
    expect(connection).toStrictEqual(connection1);
  });

  describe('create method', () => {
    let createFoodDto: CreateFoodDto;
    let categories: Category[];
    beforeEach(() => {
      createFoodDto = {
        name: 'test',
        description: 'test',
        location: 'suwon',
        site: 'https://naver.com',
        tag: [1, 2],
        grade: 4.5,
      };
      categories = [
        {
          id: 1,
          tag: FoodCategoryType.bar,
        },
        {
          id: 2,
          tag: FoodCategoryType.cafe,
        },
      ];
    });
    it('should create food', async () => {
      foodRepository.save.mockImplementationOnce((createFoodDto) => {
        return createFoodDto;
      });
      expect(await service.create('', createFoodDto)).toStrictEqual({
        ...createFoodDto,
        categories,
      });
    });

    it('should throw error if error occur', async () => {
      try {
        foodRepository.save.mockImplementationOnce(() => {
          throw new Error();
        });
        await service.create('', createFoodDto);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe('Cannot create food');
      }
    });
  });

  describe('findAll method', () => {
    let foodDatas;
    beforeAll(() => {
      foodDatas = [
        {
          id: 1,
          name: 'food1',
          location: 'location1',
          createdAt: new Date(),
          tag: 'bar',
        },
        {
          id: 2,
          name: 'food2',
          location: 'location2',
          createdAt: new Date(),
          tag: 'bar',
        },
        {
          id: 2,
          name: 'food2',
          location: 'location2',
          createdAt: new Date(),
          tag: 'cafe',
        },
      ];
    });

    it('should return exact category foodDatas when category is exist', async () => {
      foodRepository
        .createQueryBuilder()
        .getMany.mockResolvedValueOnce(
          foodDatas.filter((value) => value.tag === 'bar'),
        );
      expect(await service.findAll(FoodCategoryType.bar, 1, 1)).toStrictEqual(
        foodDatas.filter((value) => value.tag === 'bar'),
      );
    });

    it('should return all foodDatas when category is not exist', async () => {
      foodRepository
        .createQueryBuilder()
        .getMany.mockResolvedValueOnce(foodDatas);
      expect(await service.findAll(undefined, 1, 1)).toStrictEqual(foodDatas);
    });

    it('should throw error when error occur', async () => {
      try {
        foodRepository
          .createQueryBuilder()
          .getMany.mockRejectedValueOnce(new Error('error'));
        await service.findAll(undefined, 1, 1);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('조회할 수 없습니다.');
      }
    });
  });

  describe('findOne method', () => {
    it('should show data', async () => {
      const data = {
        id: 1,
        name: 'grape',
        description: 'purple grape',
        location: 'seoul',
        site: 'https://www.naver.com',
        createdAt: new Date(),
        category: 'fruit',
      };
      foodRepository.createQueryBuilder().getOne.mockResolvedValueOnce(data);
      const result = await service.findOne(1);
      expect(result).toStrictEqual(data);
    });

    it('should throw error when error occur', async () => {
      try {
        foodRepository
          .createQueryBuilder()
          .getOne.mockRejectedValue(new Error('error'));
        await service.findOne(1);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('조회할 수 없습니다.');
      }
    });
  });

  describe('update method', () => {
    let foodDatas;
    beforeAll(() => {
      jest.spyOn(connection.createQueryRunner(), 'query').mockResolvedValue({});
      jest
        .spyOn(connection.createQueryRunner(), 'startTransaction')
        .mockResolvedValue({});
      jest
        .spyOn(connection.createQueryRunner(), 'commitTransaction')
        .mockResolvedValue({});
      jest
        .spyOn(connection.createQueryRunner(), 'rollbackTransaction')
        .mockResolvedValue({});
      jest
        .spyOn(connection.createQueryRunner(), 'release')
        .mockResolvedValue({});
    });
    beforeEach(() => {
      jest
        .spyOn(connection.createQueryRunner(), 'connect')
        .mockResolvedValue({});
      foodDatas = {
        name: '알촌촌',
        description: '엄청 맛있당',
        location: 'seoul',
      };
    });

    it('should call query when foodDatas have tag', async () => {
      foodDatas.tag = [1, 2];
      await service.update(1, foodDatas);
      expect(connection.createQueryRunner().connect).toHaveBeenCalledTimes(1);
      expect(
        connection.createQueryRunner().startTransaction,
      ).toHaveBeenCalledTimes(1);
      expect(
        connection.createQueryRunner().commitTransaction,
      ).toHaveBeenCalledTimes(1);
      expect(connection.createQueryRunner().query).toHaveBeenCalledTimes(3);
      expect(
        connection.createQueryRunner().manager.update,
      ).toHaveBeenCalledTimes(1);
      expect(connection.createQueryRunner().release).toHaveBeenCalledTimes(1);
    });

    it('should not call query when foodDatas do not have tag', async () => {
      await service.update(1, foodDatas);
      expect(connection.createQueryRunner().connect).toHaveBeenCalledTimes(1);
      expect(
        connection.createQueryRunner().startTransaction,
      ).toHaveBeenCalledTimes(1);
      expect(
        connection.createQueryRunner().commitTransaction,
      ).toHaveBeenCalledTimes(1);
      expect(connection.createQueryRunner().query).not.toHaveBeenCalled();
      expect(
        connection.createQueryRunner().manager.update,
      ).toHaveBeenCalledTimes(1);
      expect(connection.createQueryRunner().release).toHaveBeenCalledTimes(1);
    });

    it('should throw error when error occurr', async () => {
      try {
        connection.createQueryRunner().connect.mockRejectedValue(new Error());
        await service.update(1, {});
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe('Cannot update food');
        expect(
          connection.createQueryRunner().rollbackTransaction,
        ).toHaveBeenCalledTimes(1);
        expect(connection.createQueryRunner().release).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('remove method', () => {
    it('should remove data', async () => {
      foodRepository.createQueryBuilder().execute.mockResolvedValue(1);
      await service.remove(1000);
      expect(await service.remove(1000)).toBe(1);
    });

    it('should throw error when remove gets wrong', async () => {
      try {
        foodRepository
          .createQueryBuilder()
          .execute.mockRejectedValue(new Error());
        await service.remove(1000);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toBe('삭제할 수 없습니다.');
      }
    });
  });
});
