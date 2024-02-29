// project.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  toDo: string;

  @Column({ default: 0 })
  done: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
