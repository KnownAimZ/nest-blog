import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartProductDto } from 'cart/dto';
import { User as UserEntity } from 'user/entities';
import { User } from 'user/decorators';
import { CartService } from './cart.service';

@ApiBearerAuth()
@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@User() user: UserEntity) {
    return this.cartService.getCart(user.id);
  }

  @Post('/add-product')
  addProduct(
    @Body() cartProductDto: CartProductDto,
    @User() user: UserEntity,
    @Req() request,
  ) {
    return this.cartService.addProduct(user.id, request.body.product_id);
  }

  @Post('/remove-product')
  removeProduct(
    @Body() cartProductDto: CartProductDto,
    @User() user: UserEntity,
    @Req() request,
  ) {
    return this.cartService.removeProduct(user.id, request.body.product_id);
  }

  @Delete()
  deleteCart(@User() user: UserEntity) {
    return this.cartService.deleteCartItems(user.id);
  }
}
