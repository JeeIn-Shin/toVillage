import {
  IsNumber,
  IsNotEmpty,
  IsEmpty,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class UpdateTodoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(9999999)
  id: number;

  @IsString()
  toDo: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;

  @IsEmpty()
  @IsString()
  deadline: string;
}
