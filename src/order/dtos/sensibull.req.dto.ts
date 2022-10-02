export class SensibullCreateDTO { 
    symbol: string;
    quantity: number;
    order_tag: string;

    constructor(symbol: string, quantity: number) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.order_tag = "test-order-tag";
    }
}

export class SensibullUpdateDTO {
    quantity: number;
}

export class SensibullStatusDTO {
    order_ids: string[];
}
