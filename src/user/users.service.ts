import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { AuthUserDto } from './dto/index';

//project, project-task, project-task-subtask 3가지로 나누어야함
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async loginUser(Auth: AuthUserDto): Promise<any> {
    const userInfo = await this.UsersRepository.find({
      where: { email: Auth.email },
    });

    if (userInfo === null) return -1;
    if (Auth.pwd !== userInfo[0].pwd) return -2;

    const filteredUserInfo = userInfo.map((user) => {
      const { pwd, ...rest } = user;
      return rest;
    });

    return filteredUserInfo;
  }
}
