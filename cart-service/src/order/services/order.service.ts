import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OrderEntity } from '../order.entity';
import { EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { Status } from '../../cart';
import { CartEntity } from "../../cart/cart.entity";
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: EntityRepository<OrderEntity>,
    @InjectRepository(CartEntity)
    private readonly cartsRepository: EntityRepository<CartEntity>,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  getAll(userId: string): Promise<OrderEntity[]> {
    return this.orderRepository.find({ userId: userId });
  }

  findById(orderId: string): Promise<OrderEntity> {
    return this.orderRepository.findOneOrFail({ id: orderId });
  }

  async create(order: any) {
    const em = this.orm.em as EntityManager;
    return await em.transactional(async (zz) => {
      const orderId = uuidv4();
      const newOrder = new OrderEntity(
          orderId,
          order.userId,
          order.cartId,
          Status.ORDERED,
          order.payment,
          order.delivery,
          order.total,
          order.comments
      );
      const item = zz.create(OrderEntity, newOrder);
      await zz.persistAndFlush(item);
      const card = await zz.findOne(CartEntity, { id: order.cartId });
      wrap(card).assign({
        status: Status.ORDERED
      });
      await zz.persistAndFlush(card);

      const cartId = uuidv4();
      const newCard = new CartEntity(
          cartId,
          order.userId,
          Status.OPEN,
      );
      const cart = await zz.create(CartEntity, newCard);
      await zz.persistAndFlush(cart);

      return { orderId: item.id };
    });
  }

  async update(orderId, data): Promise<any> {
    const order: OrderEntity = await this.findById(orderId);
    wrap(order).assign({
      payment: data.payment,
      comments: data.comments,
      delivery: data.delivery,
      total: data.total,
    });
    await this.orderRepository.persistAndFlush(order);
  }

  async deleteOrder(orderId: string): Promise<any> {
    const item = await this.orderRepository.findOneOrFail({ id: orderId });
    await this.orderRepository.removeAndFlush(item);
  }
}