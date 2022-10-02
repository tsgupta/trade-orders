import { OrderStatus } from "./order.entity";

export interface SensibullOrderEntity {
    order_id :string;
    order_tag: string;
    symbol: string;
    request_quantity: number;
    filled_quantity: number;
    status: OrderStatus;
}
