import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { FoodCategory } from './entities/food-category.entity';
import { FoodImage } from './entities/food-image.entity';
import { S3Module } from '@src/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Food, FoodImage, FoodCategory]),
    S3Module,
  ],
  controllers: [FoodsController],
  providers: [FoodsService],
})
export class FoodsModule {}
