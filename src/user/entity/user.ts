import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { UserBuildings } from 'src/village/entity/UserBuildings';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  email: string;

  @Column()
  hashedPwd: string;

  @Column({ default: 'tester' })
  username: string;

  @Column({ default: 'src/img/1.jpg' })
  profileImg: string;

  @Column({ default: 0 })
  coin: number; // total points earned by user

  @Column({ default: 0 })
  colver: number; // total placement points earned by user

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => UserBuildings, (userBuildings) => userBuildings.user)
  userBuildings: UserBuildings[];
}
