// task.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project';
import { Subtask } from './subtask';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: number;

  @Column()
  toDo: string;

  @Column({ default: 0 })
  done: number;

  @Column()
  deadline: string;

  @Column()
  indexNum: number;

  @Column()
  hexColorCode: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @OneToMany(() => Subtask, (subtask) => subtask.task)
  subtasks: Subtask[];
}
