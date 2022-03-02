import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FoodImageType } from '../enum/food-image.enum';
import { Food } from './food.entity';

@Entity()
export class FoodImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  url: string;

  @Column({
    type: 'enum',
    enum: FoodImageType,
    nullable: false,
  })
  type: FoodImageType;

  @ManyToOne(() => Food, (foods) => foods.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'food_id', referencedColumnName: 'id' })
  foods: Food;
}
