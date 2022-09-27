import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { OrderCreateDTO, OrderDeleteDTO, OrderStatusDTO, OrderUpdateDTO, SensibullCreateDTO } from '../dtos';
import { Order } from '../entities/order.entity';
import { OrderResponseDTO } from '../dtos/response.dto';
import { SensibullService } from './sensibull.service';

@Injectable()
export class OrderService {

  private timer: NodeJS.Timer;

  constructor(
    @InjectRepository(Order)
    private readonly usersRepository: Repository<Order>,
    private readonly sensibullService: SensibullService
  ) {
    if (!this.timer) {
      this.timer = setInterval(() =>
        this.syncWithSensibull()
        , 15000);
    }
  }

  private createOrderSuccessResponse(order: Order) {
    return new OrderResponseDTO(true, order);
  }

  private createOrderFailResponse(err: string) {
    return new OrderResponseDTO(false, null, err);
  }

  private async getOrderById(identifier: string) {
    return this.usersRepository
      .findOneBy({ identifier });
  }

  private async saveAndRespond(order: Order) {
    return this.usersRepository.save(order).then(this.createOrderSuccessResponse);
  }

  private async syncWithSensibull() {
    const pageSize = 1000;
    let offset = 0;
    let openOrders: Order[] = [];
    let count = 0;

    console.log(`[${new Date().toLocaleTimeString()}] Starting sync...`);
    // find and update db entries in batch
    do {
      try {
        [openOrders, count] = await this.usersRepository.findAndCount({
          take: pageSize,
          skip: offset,
          where: { order_status: "open" }
        });
        const openOrdersCount = openOrders.length;

        if (openOrdersCount > 0) {

          const sensiOrderIds = openOrders.map(order => order.order_id);
          const updatedSensiOrders = await this.sensibullService.getStatus({ order_ids: sensiOrderIds })
            .then(sensiOrders => sensiOrders.filter(o => o.status !== "open"));

          const ordersToUpdate: Order[] = [];
          openOrders.forEach(order => {
            const updatedSensiOrder = updatedSensiOrders.find(so => so.order_id === order.order_id);
            if (updatedSensiOrder) {
              order.order_status = updatedSensiOrder.status;
              ordersToUpdate.push(order);
            }
          });

          if (ordersToUpdate.length > 0) {
            // this should not need batch processing as entries were searched in batches
            const updatedOrders = await this.usersRepository.save(ordersToUpdate)
            console.log('Updated orders: ' + updatedOrders.length);
            
            offset += openOrders.length;
          }
        } else {
          console.log('No orders to sync');
        }
      } catch (e) {
        console.log('Error syncing orders: ' + e);
      }

    } while (offset < count);

    console.log(`[${new Date().toLocaleTimeString()}] Synced with Sensibull data`);
  }

  async create(createReq: OrderCreateDTO) {
    const { symbol, quantity } = createReq;
    const sensiReqBody = new SensibullCreateDTO(symbol, quantity);
    return this.sensibullService.createOrder(sensiReqBody)
      .then(sensiOrder => {
        const order = new Order(symbol, quantity, sensiOrder.order_id);
        return this.saveAndRespond(order);
      })
      .catch(this.createOrderFailResponse);
  }

  async update(updateReq: OrderUpdateDTO) {
    const { identifier, new_quantity } = updateReq;
    const order = await this.getOrderById(identifier);
    if (order.order_status === "open") {
      try {
        const sensiOrder = await this.sensibullService.update(order.order_id, { quantity: new_quantity });
        order.quantity = sensiOrder.request_quantity;
        return this.saveAndRespond(order);
      } catch (e) {
        return this.createOrderFailResponse(e);
      }
    }
    return this.createOrderFailResponse("Order is not open");
  }

  async cancel(deleteReq: OrderDeleteDTO) {
    const { identifier } = deleteReq;
    const order = await this.getOrderById(identifier)
    if (order.order_status === "open") {
      try {
        const sensiOrder = await this.sensibullService.cancel(order.order_id);
        order.order_status = sensiOrder.status;
        return this.saveAndRespond(order);
      } catch (e) {
        return this.createOrderFailResponse(e);
      }
    }
    return this.createOrderFailResponse("Order is not open");
  }

  async getStatus(statusReq: OrderStatusDTO) {
    return this.getOrderById(statusReq.identifier)
      .then(order => {
        if(!order){
          return this.createOrderFailResponse("Could not find order with identifier: " + statusReq.identifier);
        }
        return this.createOrderSuccessResponse(order);
      })
      .catch(this.createOrderFailResponse);
  }

  // async getAll() {
  //   return this.usersRepository.find();
  // }
}
