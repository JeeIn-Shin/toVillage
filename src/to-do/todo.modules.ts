import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity/index';
import { TodosController } from './todo.controllers';
import { TodosService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, Subtask])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
