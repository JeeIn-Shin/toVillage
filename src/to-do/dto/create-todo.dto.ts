import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsHexColor,
} from 'class-validator';

export class CreateTodoDto {
  @IsEmpty()
  @IsNumber()
  parentId: number;

  @IsString()
  toDo: string;

  @IsEmpty()
  @IsString()
  deadline: string;

  @IsNotEmpty()
  @IsHexColor()
  hexColorCode: string;
}
