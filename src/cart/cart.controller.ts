import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartProductDto } from './dto/cart-product.dto';

@ApiBearerAuth()
@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() request) {
    return this.cartService.getCart(request.user.id);
  }

  @Post('/add-product')
  addProduct(@Body() cartProductDto: CartProductDto, @Req() request) {
    return this.cartService.addProduct(
      request.user.id,
      request.body.product_id,
    );
  }

  @Post('/remove-product')
  removeProduct(@Body() cartProductDto: CartProductDto, @Req() request) {
    return this.cartService.removeProduct(
      request.user.id,
      request.body.product_id,
    );
  }

  @Delete()
  deleteCart(@Req() request) {
    return this.cartService.deleteCartItems(request.user.id);
  }
}
