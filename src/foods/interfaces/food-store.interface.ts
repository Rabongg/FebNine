import { Category } from './category.interface';
import { FoodImage } from './food-image.interface';

export interface FoodStore {
  id: number;
  name: string;
  location: string;
  createdAt: Date;
  categories: Category[];
  description?: string;
  grade: number;
  site?: string;
  images: FoodImage[];
}
