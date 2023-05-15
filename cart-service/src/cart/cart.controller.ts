import { Controller, Get, Delete, Body, Post, Param, Query, Put } from '@nestjs/common';
import { CartService } from './services';
import { Cart, CartItem } from "./models";

@Controller('carts')
export class CartController {
  constructor(
    private cartService: CartService,
  ) { }

  @Post()
  createCart(@Body() body: Cart) {
    return this.cartService.addCart(body);
  }

  @Put(':id/items')
  updateItem(@Param('id') cartId: string, @Body() body: CartItem) {
    return this.cartService.updateCartItem(cartId, body);
  }

  @Post(':id/items')
  addItem(@Param('id') cartId: string, @Body() body: CartItem) {
    return this.cartService.addItemToCart(cartId, body);
  }

  @Delete(':id/items/:cartItemId')
  deleteItem(@Param('id') cartId: string, @Param('cartItemId') cartItemId: string) {
    return this.cartService.removeItemFromCart(cartId, cartItemId);
  }

  @Get()
  getCart(@Query('userId') userId: string) {
    return this.cartService.getCart(userId);
  }
}