import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Basic } from './basic';
import { Task } from './task';

@Entity()
export class Subtask extends Basic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  toDo: string;

  @Column({ default: 0 })
  done: number;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'id' })
  taskId: Task;
}
