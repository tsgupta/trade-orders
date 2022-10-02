import { Order } from "../entities/order.entity";
import { SensibullOrderEntity } from "../entities/sensibull.order.entity";

export class AppResponseDTO<T> {
    success: boolean;
    payload: T;
    err_msg: string;

    constructor(success: boolean, payload: T, err_msg?: string) {
        this.success = success;
        this.payload = payload ?? undefined; //setting as undefined omits it from the response json
        this.err_msg = err_msg ?? undefined;
    }
}


export class OrderResponseDTO extends AppResponseDTO<Order> {
}

interface SensibullSuccessPayload {
    order: SensibullOrderEntity;
    message: string;        
}

export class SensibullResponseDTO extends AppResponseDTO<SensibullSuccessPayload> {
}
