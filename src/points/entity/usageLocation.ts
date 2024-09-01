import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Points } from './points';
@Entity()
export class UsageLocation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string; // 사용처 이름

  @Column({ nullable: false })
  location: string;

  @OneToOne(() => Points)
  @JoinColumn()
  usageLocation: Points;
}
