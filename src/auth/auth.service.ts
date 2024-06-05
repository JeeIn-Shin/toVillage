import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from 'src/user/entity/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(Auth: AuthUserDto): Promise<any> {
    const user = await this.usersService.findUser(Auth.email);

    if (user && (await bcrypt.compare(Auth.pwd, user.hashedPwd))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pwd, ...rest } = user;
      return rest;
    }
    return null;
  }

  async loginUser(Auth: AuthUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, pwd } = Auth;
    const user = await this.usersService.findUser(email);
    console.log(user);
    if (user && (await bcrypt.compare(pwd, user.hashedPwd))) {
      const payload = { sub: user.id, username: user.username };
      return {
        acces_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }

  async createUser(Auth: AuthUserDto): Promise<any> {
    const { email, pwd } = Auth;
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(pwd, salt);
    const user: Partial<User> = { email, hashedPwd };
    return this.usersService.createUser(user);
  }
}
