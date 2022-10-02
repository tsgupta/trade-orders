import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as env from "dotenv";

env.config();

const { HTTP_SERVER_PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HTTP_SERVER_PORT);
}
bootstrap();
