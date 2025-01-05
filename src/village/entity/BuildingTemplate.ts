import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserBuildings } from './UserBuildings';

@Entity()
export class BuildingTemplate {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  zone: number;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column()
  cost_points: number;

  @Column()
  max_count: number;

  @Column()
  placement_pts: number;

  @OneToMany(() => UserBuildings, (userBuildings) => userBuildings.building)
  userBuildings: UserBuildings[];
}
