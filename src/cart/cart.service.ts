import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserService } from 'src/user/user.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @Inject(UserService)
    private userService: UserService,
    @Inject(ProductsService)
    private productService: ProductsService,
  ) {}

  async getCart(userId: number) {
    const user = await this.userService.getDetails(userId);
    return this.cartRepository.findOneBy({ user });
  }

  async addProduct(userId: number, productId: number) {
    const user = await this.userService.getDetails(userId);
    let cart = await this.cartRepository.findOneBy({ user });
    if (!cart) {
      cart = await this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }
    const product = await this.productService.findOne(productId);
    let cartItem = await this.cartItemRepository.findOneBy({ cart, product });
    if (cartItem) {
      return await this.cartItemRepository.save({
        ...cartItem,
        quantity: cartItem.quantity + 1,
      });
    }
    cartItem = await this.cartItemRepository.create({
      cart,
      product,
      quantity: 1,
    });
    return await this.cartItemRepository.save(cartItem);
  }

  async removeProduct(userId: number, productId: number) {
    const user = await this.userService.getDetails(userId);
    let cart = await this.cartRepository.findOneBy({ user });
    if (!cart) {
      cart = await this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }
    const product = await this.productService.findOne(productId);
    const cartItem = await this.cartItemRepository.findOneBy({ cart, product });
    if (!cartItem) {
      throw new NotFoundException(`There is no cart item with such product`);
    }
    if (cartItem.quantity > 1) {
      return await this.cartItemRepository.save({
        ...cartItem,
        quantity: cartItem.quantity - 1,
      });
    }
    return await this.cartItemRepository.delete(cartItem);
  }

  async deleteCartItems(userId: number) {
    const cart = await this.cartRepository.findOneBy({ user: { id: userId } });
    if (!cart) {
      throw new NotFoundException(`Cart doesn't exists`);
    }
    await this.cartItemRepository.delete({ cart });
  }
}
