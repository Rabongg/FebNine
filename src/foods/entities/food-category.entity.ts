import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Food } from './food.entity';

export enum FoodCategoryType {
  bar = '술집',
  cafe = '카페',
  food = '음식점',
}

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
