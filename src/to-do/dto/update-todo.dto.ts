import { IsNumber, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class UpdateTodoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(9999999)
  id: number;

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
