import {
    Entity, ManyToOne, PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { CartEntity } from "./cart.entity";

@Entity({ tableName: 'cart_items' })
export class CartItemEntity {
    @PrimaryKey()
    id: string;

    @ManyToOne({ entity: () => CartEntity, })
    cart: string;

    @Property({ name: 'product_id' })
    productId : string;

    @Property({ name: 'count' })
    count : number;

    constructor(
        cartItemId: string,
        cartId: string,
        productId: string,
        count: number,
    ) {
        this.id = cartItemId;
        this.cart = cartId;
        this.productId = productId;
        this.count = count;
    }
}

export enum Status {
    OPEN = 'OPEN',
    ORDERED = 'ORDERED',
}