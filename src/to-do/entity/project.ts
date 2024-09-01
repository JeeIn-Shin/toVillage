// project.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Task } from './task';
import { User } from 'src/user/entity/user';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  toDo: string;

  @Column()
  hexColorCode: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.uuid)
  uuid: User;
}
