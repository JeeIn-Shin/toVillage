import {
  IsNumber,
  IsString,
  //IsEmpty,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class updateTodoDto {
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
