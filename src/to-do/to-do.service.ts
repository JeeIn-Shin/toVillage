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
    return await this.ProjectsRepository.find();
  }

  async getByProjectId(projectId: number): Promise<Project | null> {
    return await this.ProjectsRepository.findOne({
      where: {
        id: projectId,
      },
    });
  }

  async addNewProject(toDo: string): Promise<Project> {
    //create는 생성만 하며, 저장하지 않음
    const newProjectEntity = await this.ProjectsRepository.create({
      toDo: toDo,
    });

    //그렇기에 따로 저장하는 로직이 필요함
    return await this.ProjectsRepository.save(newProjectEntity);
  }

  async modifyProject(
    projectId: number,
    updatedProjectData: { toDo: string; done: number },
  ): Promise<Project | null> {
    //update된 entity를 반환하지 X
    await this.ProjectsRepository.createQueryBuilder()
      .update(Project)
      .set({
        toDo: updatedProjectData.toDo,
        done: updatedProjectData.done,
      })
      .where(`id = :id`, { id: projectId })
      .execute();

    return await this.ProjectsRepository.findOne({
      where: {
        id: projectId,
      },
    });
  }

  async deleteProject(projectId: number): Promise<Project> {
    const targetProject = await this.ProjectsRepository.findOne({
      where: {
        id: projectId,
      },
    });

    return await this.ProjectsRepository.remove(targetProject);
  }
}
