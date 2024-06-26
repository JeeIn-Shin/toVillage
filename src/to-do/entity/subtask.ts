// subtask.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Task } from './task';

@Entity()
export class Subtask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

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

  @ManyToOne(() => Task, (task) => task.subtasks)
  task: Task;
}
