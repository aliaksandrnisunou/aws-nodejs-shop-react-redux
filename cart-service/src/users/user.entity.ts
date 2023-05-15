import {
    Entity, ManyToOne, PrimaryKey,
    Property,
} from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class UserEntity {
    @PrimaryKey()
    id: string;

    @Property({ name: 'name' })
    name : string;

    @Property({ name: 'username' })
    username : string;

    @Property({ name: 'password' })
    password : string;

    constructor(
        id: string,
        username: string,
        password: string,
        name: string,
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
    }
}