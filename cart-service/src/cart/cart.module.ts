import { Module } from '@nestjs/common';
import { MikroOrmModule} from "@mikro-orm/nestjs";
import { OrderEntity } from '../order/order.entity';
import { CartController } from './cart.controller';
import { CartEntity } from './cart.entity';
import { CartItemEntity } from './cart-items.entity';
import { CartService } from './services';

@Module({
  imports: [ CartModule, MikroOrmModule.forFeature({ entities: [CartEntity, CartItemEntity, OrderEntity]}) ],
  providers: [ CartService ],
  exports: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
