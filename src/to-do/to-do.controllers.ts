import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './to-do.service';
import { Project } from './entity';

@Controller('project')
export class ProjectsController {
  constructor(private projectService: ProjectService) {}

  @Get('')
  findAll(): Promise<Project[] | null> {
    return this.projectService.findAll();
  }
}
