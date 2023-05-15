import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import { OrderService } from "./services";

@Controller('orders')
export class OrderController {
    constructor(
        private orderService: OrderService
    ) {
    }

    @Get()
    getAll(@Query('userId') userId: string): Promise<any> {
        return this.orderService.getAll(userId);
    }

    @Get(':id')
    getById(@Param('id') id: string): Promise<any> {
        return this.orderService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any): Promise<any> {
        return this.orderService.update(id, body);
    }

    @Post()
    create(@Body() body: any): Promise<any> {
        return this.orderService.create(body);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<any> {
        return this.orderService.deleteOrder(id);
    }
}