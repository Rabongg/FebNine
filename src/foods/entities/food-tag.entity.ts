import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FoodCategoryType {
  술집 = '술집',
  카페 = '카페',
  음식점 = '음식점',
}

@Entity()
export class FoodTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FoodCategoryType,
    nullable: false,
  })
  tag: FoodCategoryType;
}
