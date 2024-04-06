import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsHexColor,
  Min,
  Max,
} from 'class-validator';

export class UpdateTodoDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(9999999)
  id: number;

  @IsOptional()
  @IsString()
  toDo: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;

  @IsOptional()
  @IsString()
  deadline: string;

  @IsOptional()
  @IsNumber()
  indexNum: number;

  @IsOptional()
  @IsHexColor()
  hexColorCode: string;
}
