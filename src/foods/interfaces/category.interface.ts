import { FoodCategoryType } from '../enum/food-category.enum';

export interface Category {
  id?: number;
  tag: FoodCategoryType;
}
