import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { OrderCreateDTO, OrderDeleteDTO, OrderStatusDTO, OrderUpdateDTO } from './dtos/order.req.dto';
import { OrderService } from './services/order.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/user-service")
export class OrderController {

  constructor(private readonly orderService: OrderService) {}
  
  // @Get()
  // getAllOrders(){
  //   return this.orderService.getAll();
  // }

  @Post()
  createOrder(@Body() reqBody: OrderCreateDTO) {
    return this.orderService.create(reqBody);
  }

  @Put()
  updateQuantity(@Body() req: OrderUpdateDTO) {
    return this.orderService.update(req);
  }

  @Delete()
  deleteOrder(@Body() req: OrderDeleteDTO ){
    return this.orderService.cancel(req);
  }

  @Post("status")
  getStatus(@Body() req: OrderStatusDTO) {
    return this.orderService.getStatus(req);
  }
  
}
