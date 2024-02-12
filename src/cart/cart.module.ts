import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from 'cart/entities';
import { ProductsModule } from 'products';
import { UserModule } from 'user';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
