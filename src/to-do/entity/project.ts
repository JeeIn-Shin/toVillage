import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Basic } from './basic';
import { Task } from './task';

@Entity()
export class Project extends Basic {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  toDo: string;

  @Column({ default: 0 })
  done: number;

  @OneToMany(() => Task, (task) => task.projectId)
  task: Task[];
}
