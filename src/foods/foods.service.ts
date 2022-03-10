import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { Repository, Connection } from 'typeorm';
import { Category } from './interfaces/category.interface';
import { FoodStore } from './interfaces/food-store.interface';
import { FoodCategoryType } from './enum/food-category.enum';
import { S3Service } from '@src/s3/s3.service';
import { FoodImage } from './interfaces/food-image.interface';
import { FoodImageType } from './enum/food-image.enum';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    private connection: Connection,
    private readonly s3Service: S3Service,
  ) {}

  async create(files: any, createFoodDto: CreateFoodDto) {
    try {
      const { tag } = createFoodDto;
      const categories: Category[] = [];
      const images: FoodImage[] = [];
      tag.forEach((value) => {
        if (value == 1) categories.push({ id: 1, tag: FoodCategoryType.bar });
        else if (value == 2)
          categories.push({ id: 2, tag: FoodCategoryType.cafe });
        else categories.push({ id: 3, tag: FoodCategoryType.food });
      });
      const imagePath = await this.s3Service.filesUpload(files);
      imagePath.forEach((value) => {
        if ('thumbnail' in value)
          images.push({
            url: value.thumbnail,
            type: FoodImageType.thumbnail,
          });
        else
          images.push({
            url: value.content,
            type: FoodImageType.content,
          });
      });
      const food = await this.foodRepository.save({
        ...createFoodDto,
        categories,
        images,
      });
      return food;
    } catch (err) {
      console.log(err);
      throw new ConflictException('Cannot create food');
    }
  }

  async findAll(
    category: FoodCategoryType,
    page: number,
    limit: number,
  ): Promise<FoodStore[]> {
    try {
      let query = this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.categories', 'food_category')
        .leftJoinAndSelect('food.images', 'food_image')
        .select([
          'food.id',
          'food.name',
          'food.location',
          'food.site',
          'food.createdAt',
          'food.grade',
          'food_category.tag',
          'food_image.url',
          'food_image.type',
        ]);
      if (category) {
        query = query.where('food_category.tag = :tag', { tag: category });
      }
      return await query
        .orderBy('food.createdAt', 'DESC')
        .offset((page - 1) * limit)
        .limit(limit)
        .getMany();
    } catch (err) {
      throw new NotFoundException('조회할 수 없습니다.');
    }
  }

  async findOne(id: number): Promise<FoodStore> {
    try {
      const foodData = await this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.categories', 'food_category')
        .leftJoinAndSelect('food.images', 'food_image')
        .select([
          'food.id',
          'food.name',
          'food.description',
          'food.location',
          'food.grade',
          'food.site',
          'food.createdAt',
          'food_category.tag',
          'food_image.url',
        ])
        .where('food.id = :id', { id: id })
        .andWhere('food_image.type = :type', { type: FoodImageType.content })
        .getOne();
      return foodData;
    } catch (err) {
      throw new NotFoundException('조회할 수 없습니다.');
    }
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    const queryRunner = this.connection.createQueryRunner();
    const { tag } = updateFoodDto;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      if (tag) {
        await queryRunner.query(`delete from food_tag where food_id = "${id}"`);
        for (let i = 0; i < tag.length; i++) {
          await queryRunner.query(
            `insert into food_tag (food_id, category_id) values ("${id}", "${tag[i]}")`,
          );
        }
        delete updateFoodDto.tag;
      }
      await queryRunner.manager.update(Food, id, updateFoodDto);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Cannot update food');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    try {
      return await this.foodRepository
        .createQueryBuilder()
        .delete()
        .from(Food)
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      throw new ConflictException('삭제할 수 없습니다.');
    }
  }
}
