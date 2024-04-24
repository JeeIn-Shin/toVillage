import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity/index';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, Subtask])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
