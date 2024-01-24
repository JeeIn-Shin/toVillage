import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Basic } from './basic';
import { Project, Subtask } from './index';

@Entity()
export class Task extends Basic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  toDo: string;

  @Column({ default: 0 })
  done: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'id' })
  projectId: Project;

  @OneToMany(() => Subtask, (Subtask) => Subtask.taskId)
  Subtask: Subtask[];
}
