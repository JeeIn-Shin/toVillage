import { IsNumber, IsString, IsEmpty, Min, Max } from 'class-validator';

export class createTodoDto {
  @IsString()
  toDo: string;

  @IsEmpty()
  @IsString()
  deadline: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;
}
