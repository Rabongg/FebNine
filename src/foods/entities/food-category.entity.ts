import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FoodCategoryType } from '../enum/food-category.enum';
import { Food } from './food.entity';

@Entity()
export class FoodCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FoodCategoryType,
    nullable: false,
    unique: true,
  })
  tag: FoodCategoryType;

  @ManyToMany(() => Food, (foods) => foods.categories)
  foods: Food[];
}
