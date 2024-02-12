import { Category } from 'categories/entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: 0 })
  price: number;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
