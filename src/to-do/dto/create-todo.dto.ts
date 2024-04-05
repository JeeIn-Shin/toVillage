import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsHexColor,
} from 'class-validator';

export class CreateTodoDto {
  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsNotEmpty()
  @IsString()
  toDo: string;

  @IsOptional()
  @IsString()
  deadline: string;

  @IsOptional()
  @IsHexColor()
  hexColorCode: string;
}
