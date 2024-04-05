import {
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsEmpty,
  IsHexColor,
} from 'class-validator';
import { Type } from 'class-transformer';

class SubtaskDto {
  @IsNumber()
  id: number;

  @IsNumber()
  projectId: number;

  @IsNumber()
  taskId: number;

  @IsString()
  toDo: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;

  @IsEmpty()
  deadline: string;

  @IsNumber()
  indexNum: number;

  @IsHexColor()
  hexColorCode: string;
}

class TaskDto {
  @IsNumber()
  id: number;

  @IsNumber()
  projectId: number;

  @IsString()
  toDo: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;

  @IsEmpty()
  deadline: string;

  @IsNumber()
  indexNum: number;

  @IsHexColor()
  hexColorCode: string;

  @ValidateNested()
  @Type(() => SubtaskDto)
  @IsOptional()
  subtask?: SubtaskDto;
}

export class TodoDto {
  @IsNumber()
  id: number;

  @IsString()
  toDo: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  done: number;

  @IsHexColor()
  hexColorCode: string;

  @ValidateNested()
  @Type(() => TaskDto)
  @IsOptional()
  task?: TaskDto;
}
