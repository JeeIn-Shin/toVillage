import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user';
import { UserService } from './users.service';
import { userController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [userController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
