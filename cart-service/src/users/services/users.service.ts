import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../models';
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import { UserEntity } from "../user.entity";
import { CartService } from "../../cart";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: EntityRepository<UserEntity>,
        private readonly cartService: CartService,
    ) {
    }

    async login(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({username, password});
        if (!user) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        let cartId;
        try {
            const card = await this.cartService.getCart(user.id);
            cartId = card.id;
        } catch (e) {
            cartId = await this.cartService.addCart({
                userId: user.id,
                updatedAt: new Date(),
                createdAt: new Date(),
            });
        }

        return {
            user,
            cartId,
        };
    }

    findOneBy(userId: string): Promise<UserEntity> {
        return this.userRepository.findOneOrFail({ id: userId });
    }

    async signup(name, password, username): Promise<any> {
        const userId = uuidv4();
        const newUser = new UserEntity(userId, username, password, name);
        const user = await this.userRepository.create(newUser);
    
        await this.userRepository.persist(user).flush();

        return { userId };
    }
}