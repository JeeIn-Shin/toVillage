import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './to-do/todo.modules';
import { Project, Task, Subtask } from './to-do/entity';
import { LoggerMiddleware } from 'middleware/logger.middleware';
import config from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config().database.host,
      port: config().database.port,
      username: config().database.user,
      password: config().database.pwd,
      database: 'tovillage',
      entities: [Project, Task, Subtask],
      //true시 QueryFailedError: Encoding not recognized: 'undefined' (searched as: 'undefined') 에러 발생
      //synchronize가 대체 무슨 옵션인가
      synchronize: true,
      logging: true,
    }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 모든 경로에 미들웨어 적용
  }
}
