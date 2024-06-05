import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async findUser(email: string): Promise<any> {
    const user = await this.UsersRepository.find({
      where: { email: email },
    });
    return user[0];
  }

  async createUser(user: Partial<User>): Promise<void> {
    const newUser = this.UsersRepository.create(user);
    await this.UsersRepository.save(newUser);
  }
}
