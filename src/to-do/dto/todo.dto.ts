import {
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsEmpty,
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

  @ValidateNested()
  @Type(() => TaskDto)
  @IsOptional()
  task?: TaskDto;
}
