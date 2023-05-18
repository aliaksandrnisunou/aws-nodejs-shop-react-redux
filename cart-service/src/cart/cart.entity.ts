import {
    Collection,
    Entity,
    Enum, OneToMany,
    PrimaryKey,
    Property,
    Unique
} from '@mikro-orm/core';
import { CartItemEntity } from "./cart-items.entity";
import { Status } from "./models";

@Entity({ tableName: 'carts' })
export class CartEntity {
    @PrimaryKey()
    @Unique()
    id: string;

    @Property({ name: 'user_id' })
    userId: string;

    @Property({ name: 'created_at' })
    createdAt: Date = new Date();

    @Property({ name: 'updated_at', onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Enum(() => Status)
    status: Status;

    @OneToMany(() => CartItemEntity, book => book.cart)
    items = new Collection<CartItemEntity>(this);

    constructor(
        id: string,
        userId: string,
        status: Status,
    ) {
        this.id = id;
        this.userId = userId;
        this.status = status;
    }
}