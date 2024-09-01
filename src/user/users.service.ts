import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { UpdateUserDto } from './dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async getUserbyEmail(email: string): Promise<any> {
    const user = await this.UsersRepository.find({
      where: { email: email },
    });
    return user[0];
  }

  async getUserbyUuid(uuid: string): Promise<any> {
    const user = await this.UsersRepository.find({
      where: { uuid: uuid },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUuidbyname(name: string): Promise<any> {
    const user = await this.UsersRepository.find({
      where: { username: name },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user[0].uuid;
  }

  async createUser(user: Partial<User>): Promise<void> {
    const checkUser = this.getUserbyEmail(user.email);
    if (checkUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
    const newUser = this.UsersRepository.create(user);
    await this.UsersRepository.save(newUser);
  }

  //player가 설정화면에서 변경할 수 있는 부분을 처리하는 method
  //username, profileImg
  //검색 기준은 uuid
  async updateUserProfile(
    accessToken: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    let user = await this.authService.decodeAccessToken(accessToken);
    user = await this.getUserbyEmail(user['email']);

    user.username = updateUserDto.username;
    user.profileImg = updateUserDto.profileImg;

    await this.UsersRepository.save(user);

    return {
      username: user.username,
      profileImg: user.profileImg,
    };
  }
  //비밀번호 확인 -나중에 구현

  //비밀번호 변경

  //refreshToken 변경
  async updateUserRefreshToken(
    uuid: string,
    changedHashedRefreshToken: string | null,
  ): Promise<void> {
    const user = await this.getUserbyUuid(uuid);

    user[0].currentHashedRefreshToken = changedHashedRefreshToken;

    await this.UsersRepository.save(user);
  }
}
