import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsEmpty()
  @IsNumber()
  parentId: number;

  @IsString()
  toDo: string;

  // @IsEmpty()
  // @IsString()
  // deadline: string;
}
