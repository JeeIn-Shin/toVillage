import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entity/user';
import { BuildingTemplate } from './BuildingTemplate';

@Entity()
export class UserBuildings {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.uuid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => BuildingTemplate, (building) => building.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'building_id' })
  building: BuildingTemplate;

  @Column()
  zone: number;

  @Column()
  count: number;
}
