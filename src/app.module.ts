import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'middleware/logger.middleware';
import config from '../config/configuration';
import { Project, Task, Subtask } from './to-do/entity';
import { User } from './user/entity/user';
import { Points, UsageLocation } from './points/entity';
import { UserBuildings, BuildingTemplate} from './village/entity';
import { UserModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { PointsModule } from './points/points.module';
import { TodosModule } from './to-do/todos.module';
import { VillageModule } from './village/village.module';

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
      entities: [Project, Task, Subtask, User, Points, UsageLocation, UserBuildings, BuildingTemplate],
      //true시 QueryFailedError: Encoding not recognized: 'undefined' (searched as: 'undefined') 에러 발생
      //synchronize가 대체 무슨 옵션인가
      synchronize: true,
      logging: true,
    }),
    TodosModule,
    UserModule,
    AuthModule,
    PointsModule,
    VillageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 모든 경로에 미들웨어 적용
  }
}
