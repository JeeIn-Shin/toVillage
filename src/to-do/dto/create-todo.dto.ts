import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  toDo: string;

  // @IsEmpty()
  // @IsString()
  // deadline: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;
}
