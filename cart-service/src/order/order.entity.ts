import {
    Entity,
    Enum,
    PrimaryKey,
    Property,
    Unique,
} from '@mikro-orm/core';
import { Status } from '../cart';

@Entity({ tableName: 'orders' })
export class OrderEntity {
    @PrimaryKey()
    @Unique()
    id: string;

    @Property({ name: 'user_id' })
    userId: string;

    @Property({ name: 'cart_id' })
    cartId: string;

    @Property({ name: 'payment', type: 'json' })
    payment: any;

    @Property({ name: 'delivery', type: 'json' })
    delivery: any;

    @Property({ name: 'comments' })
    comments: string;

    @Property({ name: 'total'})
    total : number;

    @Enum(() => Status)
    status : Status;

    constructor(
        id: string,
        userId: string,
        cartId: string,
        status: Status,
        payment: any,
        delivery: any,
        total: number,
        comments: string
    ) {
        this.id = id;
        this.userId = userId;
        this.cartId = cartId;
        this.status = status;
        this.total = total;
        this.comments = comments;
        this.delivery = delivery;
        this.payment = payment;
    }
}