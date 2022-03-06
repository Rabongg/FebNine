import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FoodCategory } from './food-category.entity';
import { FoodImage } from './food-image.entity';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  location: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  site: string;

  @Column({ type: 'float', nullable: true })
  grade: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => FoodCategory, (foodCategory) => foodCategory.foods, {
    cascade: true,
  })
  @JoinTable({
    name: 'food_tag',
    joinColumn: { name: 'food_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: FoodCategory[];

  @OneToMany(() => FoodImage, (foodImages) => foodImages.foods, {
    cascade: true,
  })
  images: FoodImage[];
}
