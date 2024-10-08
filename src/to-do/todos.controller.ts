import {
  Get,
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodoDto, CreateTodoDto, UpdateTodoDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { User } from 'src/user/entity/user';

@UseGuards(JwtAuthGuard)
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
  addNewTodo(@Body() todo: CreateTodoDto, name: User): Promise<any> {
    return this.todoService.addNewTodo(todo, name);
  }

  @Put('')
  modifyTodo(@Body() todo: UpdateTodoDto): Promise<TodoDto | null> {
    return this.todoService.modifyTodo(todo);
  }

  @Put('order')
  modifyOrder(@Body() todo: UpdateTodoDto[]): Promise<TodoDto[]> {
    return this.todoService.modifyOrder(todo);
  }

  @Put('done')
  modifyDone(@Body() todo: UpdateTodoDto): Promise<TodoDto> {
    return this.todoService.modifyDone(todo);
  }

  @Delete(':id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const result = await this.todoService.deleteTodo(id);
    if (result === 1) return null;
    else if (result !== -1) return result;

    return {
      statusCode: HttpStatus.OK,
      detail: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Invalid delete request`,
      },
    };
  }
}
