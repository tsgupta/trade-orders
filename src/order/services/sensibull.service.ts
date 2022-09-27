import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from "axios";
import { firstValueFrom, Observable } from 'rxjs';
import { SensibullOrderEntity } from '../entities/sensibull.order.entity';
import { AppResponseDTO, SensibullCreateDTO, SensibullResponseDTO, SensibullStatusDTO, SensibullUpdateDTO } from '../dtos';
import { SENSIBULL_ORDER_PLACE_URL, SENSIBULL_ORDER_STATUS_URL } from './url.constants';

@Injectable()
export class SensibullService {

    constructor(
        private readonly httpService: HttpService
    ) { }

    private async getSensibullOrder(sensiReq: Observable<AxiosResponse<SensibullResponseDTO, any>>) {
        const { data: { success, payload, err_msg } } = await firstValueFrom(sensiReq);
        if (success) {
            return Promise.resolve(payload.order);
        }
        return Promise.reject(err_msg);
    }

    async createOrder(createPayload: SensibullCreateDTO) {
        const sensiReq = this.httpService.post<SensibullResponseDTO>(SENSIBULL_ORDER_PLACE_URL, createPayload);
        return this.getSensibullOrder(sensiReq);
    }

    async update(orderId: string, updatePayload: SensibullUpdateDTO) {
        const sensiReq = this.httpService.put<SensibullResponseDTO>(`${SENSIBULL_ORDER_PLACE_URL}/${orderId}`, updatePayload);
        return this.getSensibullOrder(sensiReq);
    }

    async cancel(orderId: string) {
        const sensiReq = this.httpService.delete<SensibullResponseDTO>(`${SENSIBULL_ORDER_PLACE_URL}/${orderId}`);
        return this.getSensibullOrder(sensiReq);
    }

    async getStatus(statusPayload: SensibullStatusDTO) {
        const sensiReq = this.httpService.post<AppResponseDTO<SensibullOrderEntity[]>>(SENSIBULL_ORDER_STATUS_URL, statusPayload);
        const { data: { success, payload, err_msg } } = await firstValueFrom(sensiReq);
        console.log(payload);
        if (success) {
            return payload;
        }
        return Promise.reject(err_msg);
    }

}
