import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity/index';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { UserModule } from 'src/user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, Subtask]), UserModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
