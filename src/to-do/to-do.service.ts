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

  async findAll(): Promise<Project[] | null> {
    return this.ProjectsRepository.find();
  }
}
