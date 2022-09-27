import { Column, Entity, PrimaryColumn } from 'typeorm';
import { generate } from "shortid";
import { Exclude } from 'class-transformer';

@Entity()
export class Order {

    constructor(symbol: string, quantity: number, sensiOrderId: string) {
        this.identifier = generate();
        this.order_id = sensiOrderId;
        this.symbol = symbol;
        this.quantity = quantity;
        this.filled_quantity = 0;
        this.order_status = "open";
    }

    @PrimaryColumn('varchar')
    identifier: string;

    // holds order id of sensibull orders
    @Column()
    @Exclude()
    order_id: string;

    @Column()
    symbol: string;

    @Column()
    quantity: number;

    @Column({ default: 0 })
    filled_quantity: number;

    @Column()
    order_status: OrderStatus;
}

export type OrderStatus = "open" | "complete" | "error" | "cancel";
