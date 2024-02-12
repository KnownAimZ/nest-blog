import { Product } from 'products/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from 'cart/entities';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, { eager: true })
  @JoinColumn()
  product: Product;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;
}
