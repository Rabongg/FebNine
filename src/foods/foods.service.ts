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
import { FoodCategoryType } from './entities/food-category.entity';
import { Category } from './interfaces/category.interface';
import { FoodStore } from './interfaces/food-store.interface';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
    private connection: Connection,
  ) {}

  async create(createFoodDto: CreateFoodDto) {
    try {
      const { tag } = createFoodDto;
      const categories: Category[] = [];
      tag.forEach((value) => {
        if (value == 1) categories.push({ id: 1, tag: FoodCategoryType.bar });
        else if (value == 2)
          categories.push({ id: 2, tag: FoodCategoryType.cafe });
        else categories.push({ id: 3, tag: FoodCategoryType.food });
      });
      const food = await this.foodRepository.save({
        ...createFoodDto,
        categories,
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
      let foodDatas: Food[];
      if (category) {
        foodDatas = await this.foodRepository
          .createQueryBuilder('food')
          .leftJoinAndSelect('food.categories', 'food_category')
          .select([
            'food.id',
            'food.name',
            'food.location',
            'food.createdAt',
            'food_category.tag',
          ])
          .where('food_category.tag = :tag', { tag: category })
          .offset((page - 1) * limit)
          .limit(limit)
          .getMany();
      } else {
        foodDatas = await this.foodRepository
          .createQueryBuilder('food')
          .leftJoinAndSelect('food.categories', 'food_category')
          .select([
            'food.id',
            'food.name',
            'food.location',
            'food.createdAt',
            'food_category.tag',
          ])
          .offset((page - 1) * limit)
          .limit(limit)
          .getMany();
      }
      return foodDatas;
    } catch (err) {
      console.log(err);
      throw new NotFoundException('조회할 수 없습니다.');
    }
  }

  async findOne(id: number): Promise<FoodStore> {
    try {
      const foodData = await this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.categories', 'food_category')
        .select([
          'food.id',
          'food.name',
          'food.description',
          'food.location',
          'food.site',
          'food.createdAt',
          'food_category.tag',
        ])
        .where('food.id = :id', { id: id })
        .getOne();
      return foodData;
    } catch (err) {
      console.log(err);
      throw new NotFoundException('조회할 수 없습니다.');
    }
  }

  async update(id: number, updateFoodDto: UpdateFoodDto) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { tag } = updateFoodDto;
    try {
      if (tag) {
        await queryRunner.query(`delete from food_tag where food_id = "${id}"`);
        for (let i = 0; i < tag.length; i++) {
          await queryRunner.query(
            `insert into food_tag (food_id, category_id) values ("${id}", "${tag[i]}")`,
          );
        }
        delete updateFoodDto.tag;
      }
      const food = await queryRunner.manager.update(Food, id, updateFoodDto);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
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
