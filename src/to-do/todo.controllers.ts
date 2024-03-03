import {
  Get,
  Controller,
  Post,
  Put,
  //Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from './todo.service';
//import { Task } from './entity';
import { todoFormtDto } from './dto/todo.dto';
import { updateTodoDto } from './dto/update-todo.dto';
//project, project-task, project-task-subtask 3가지로 나누어야함
@Controller('to-do')
export class TodosController {
  constructor(private todoService: TodosService) {}

  @Get('')
  getAllTodos(): Promise<todoFormtDto[] | null> {
    return this.todoService.getAllTodos();
  }

  @Get(':id')
  //@Param 데코레이터로 받은 값은 기본적으로 문자열(string)로 처리됨. 이는 경로 매개변수의 값이 문자열로 전달되기 때문.
  getByTodosId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<todoFormtDto | null> {
    return this.todoService.getByTodosId(id);
  }

  @Post('')
  addNewTodo(@Body() todo: todoFormtDto): Promise<any> {
    return this.todoService.addNewTodo(todo);
  }

  @Put(':id')
  modifyTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() todo: updateTodoDto,
  ): Promise<todoFormtDto | null> {
    return this.todoService.modifyTodo(id, todo);
  }

  // @Delete(':id')
  // deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<Task | null> {
  //   return this.todoService.deleteTodo(id);
  // }
}
