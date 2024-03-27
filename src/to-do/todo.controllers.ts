import {
  Get,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Redirect,
} from '@nestjs/common';
import { TodosService } from './todo.service';
//import { Task } from './entity';
import { TodoDto, CreateTodoDto, UpdateTodoDto } from './dto';
//project, project-task, project-task-subtask 3가지로 나누어야함
@Controller('to-do')
export class TodosController {
  constructor(private todoService: TodosService) {}

  @Get('')
  getAllTodos(): Promise<TodoDto[] | null> {
    return this.todoService.getAllTodos();
  }

  @Get(':id')
  //@Param 데코레이터로 받은 값은 기본적으로 문자열(string)로 처리됨. 이는 경로 매개변수의 값이 문자열로 전달되기 때문.
  getByTodosId(@Param('id', ParseIntPipe) id: number): Promise<TodoDto | null> {
    return this.todoService.getByTodosId(id);
  }

  @Post('')
  addNewTodo(@Body() todo: CreateTodoDto): Promise<any> {
    return this.todoService.addNewTodo(todo);
  }

  @Put('')
  modifyTodo(@Body() todo: UpdateTodoDto): Promise<TodoDto | null> {
    return this.todoService.modifyTodo(todo);
  }

  @Put('order')
  modifyOrder(@Body() todo: UpdateTodoDto[]): Promise<TodoDto[]> {
    return this.todoService.modifyOrder(todo);
  }

  @Delete(':id')
  @Redirect('http://localhost:8080/to-do', 302)
  async deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const result = await this.todoService.deleteTodo(id);
    console.log('controller', result);
    if (result === 1) return;
    else if (result !== -1) {
      return { url: `http://localhost:8080/to-do/${result}` };
    }
    //이 부분 에러발생 페이지로 이동하게끔, 혹은 팝업창이 뜨게 하던가...
    //어떻게 처리해야할지 논의해야함
    return { url: `http://localhost:8080/` };
  }
}
