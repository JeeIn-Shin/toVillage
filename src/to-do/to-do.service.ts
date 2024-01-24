import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private ProjectsRepository: Repository<Project>,
  ) {}

  async getAll(): Promise<Project[] | null> {
    return this.ProjectsRepository.find();
  }

  async getByProjectId(projectId: number): Promise<Project | null> {
    const todo = this.ProjectsRepository.findOne({
      where: {
        id: projectId,
      },
    });

    return todo;
  }

  async addNewProject(toDo: string): Promise<Project> {
    //create는 생성만 하며, 저장하지 않음
    const newProjectEntity = this.ProjectsRepository.create({
      toDo: toDo,
    });

    //그렇기에 따로 저장하는 로직이 필요함
    return await this.ProjectsRepository.save(newProjectEntity);
  }
}
