import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { SensibullService } from './services/sensibull.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    HttpModule.register({
      timeout: 5000,
      headers: { "X-AUTH-TOKEN": "e9e24a93-7de0-4f57-9a87-d14a3dc06cda" }
    })
  ],
  controllers: [OrderController],
  providers: [OrderService, SensibullService],
})
export class AppModule {}
