import { FoodCategoryType } from '../entities/food-category.entity';

export interface Category {
  id?: number;
  tag: FoodCategoryType;
}
