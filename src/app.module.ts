import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AppModule as OrderModule} from "./order/order.module";
import * as env from "dotenv";

env.config();

const {
  MYSQL_USER,
  MYSQL_PASS,
  MYSQL_DATABASE,
  MYSQL_PORT
} = process.env;

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: Number.parseInt(MYSQL_PORT),
    username: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
  }),
  OrderModule]
})
export class AppModule {}
