export class OrderCreateDTO {
    symbol: string;
    quantity: number;
}

export class OrderUpdateDTO {
    identifier: string;
    new_quantity: number;
}

export class OrderDeleteDTO {
    identifier: string;
}

export class OrderStatusDTO {
    identifier: string;
}

