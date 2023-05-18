import { Module } from '@nestjs/common';
import { UsersService } from './services';
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "./user.entity";
import { UsersController } from "./user.controller";
import { CartService } from "../cart";
import { CartEntity } from "../cart/cart.entity";
import { CartItemEntity } from "../cart/cart-items.entity";

@Module({
  providers: [ UsersService, CartService ],
  exports: [ UsersService ],
  controllers: [ UsersController ],
  imports: [MikroOrmModule.forFeature({entities: [UserEntity, CartEntity, CartItemEntity]})]
})
export class UsersModule {}