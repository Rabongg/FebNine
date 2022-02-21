import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { FoodCategory } from './entities/food-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Food, FoodCategory])],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}
