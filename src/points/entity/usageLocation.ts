import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Points } from './points';
@Entity()
export class UsageLocation {
  @Column({ nullable: false })
  name: string; // 사용처 이름

  @Column({ nullable: false })
  location: string;

  @PrimaryColumn()
  @OneToOne(() => Points)
  @JoinColumn()
  id: number;
}
