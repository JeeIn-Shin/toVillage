import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
}
