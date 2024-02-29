import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(config().port);
}
bootstrap();
