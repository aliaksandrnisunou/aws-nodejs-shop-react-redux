import { Injectable } from '@nestjs/common';
import { Cart, CartItem, Status } from '../models';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CartEntity } from '../cart.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { CartItemEntity } from '../cart-items.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartsRepository: EntityRepository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepository: EntityRepository<CartItemEntity>,
  ) {}

  async getCart(userId: string): Promise<CartEntity> {
    return this.cartsRepository.findOne(
      { userId, status: Status.OPEN },
      { 
        populate: ['items'],
        fields: ['id', 'userId', 'createdAt', 'updatedAt', 'status'],
        orderBy: { createdAt: 'desc' }
      }
    );
  }

  async addCart(body: Cart): Promise<any> {
    const cartId = uuidv4();
    const newCart = new CartEntity(
      cartId,
      body.userId,
      Status.OPEN,
    );
    const cart = await this.cartsRepository.create(newCart);
    await this.cartsRepository.persistAndFlush(cart);
  
    return { cartId: cart.id };
  }

  async addItemToCart(cartId: string, item: CartItem): Promise<any> {
    const cartItemId = uuidv4();
    const newItem = new CartItemEntity(cartItemId, cartId, item.productId, item.count);
    const createdItem = await this.cartItemsRepository.create(newItem);

    await this.cartItemsRepository.persistAndFlush(createdItem);

    return { cartItemId };
  }

  async updateCartItem(
    cartId: string,
    item: CartItem,
  ): Promise<any> {
    const cartItem = await this.cartItemsRepository.findOneOrFail({
      cart: cartId,
      productId: item.productId,
    });
    wrap(cartItem).assign({
      count: item.count,
    });
    
    return this.cartItemsRepository.persistAndFlush(cartItem);
  }

  async removeItemFromCart(cartId: string, cartItemId: string): Promise<any> {
    const cardItem = await this.cartItemsRepository.findOneOrFail({
      cart: cartId,
      id: cartItemId,
    });
    return this.cartItemsRepository.removeAndFlush(cardItem);
  }

  async deleteCart(cartId: string): Promise<any> {
    const item = await this.cartsRepository.findOneOrFail({ id: cartId });
    return this.cartsRepository.removeAndFlush(item);
  }
}