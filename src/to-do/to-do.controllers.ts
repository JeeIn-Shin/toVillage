import {
  Controller,
  Get,
  Post,
  //Put,
  //Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectService } from './to-do.service';
import { Project } from './entity';

@Controller('to-do')
export class ProjectsController {
  constructor(private projectService: ProjectService) {}

  @Get('')
  getAll(): Promise<Project[] | null> {
    return this.projectService.getAll();
  }

  @Get(':id')
  //@Param 데코레이터로 받은 값은 기본적으로 문자열(string)로 처리됨. 이는 경로 매개변수의 값이 문자열로 전달되기 때문.
  getByProjectId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project | null> {
    return this.projectService.getByProjectId(id);
  }

  @Post('')
  addNewProject(@Body('project') project: { toDo: string }): Promise<Project> {
    return this.projectService.addNewProject(project.toDo);
  }

  //@Put('')

  //@Delete('')
}
