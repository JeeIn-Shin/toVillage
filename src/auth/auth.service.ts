import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from 'src/user/entity/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    @Inject('ACCESS_TOKEN_SERVICE') private accessTokenService: JwtService,
    @Inject('REFRESH_TOKEN_SERVICE') private refreshTokenService: JwtService,
  ) {}

  async validateUser(Auth: AuthUserDto): Promise<any> {
    const user = await this.usersService.getUserbyEmail(Auth.email);

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
    const user = await this.usersService.getUserbyEmail(email);
    const payload = { email: user.email, uuid: user.uuid };

    return {
      access_token: this.accessTokenService.sign(payload),
      refresh_token: this.refreshTokenService.sign(payload),
    };
  }

  async logoutUser(accessToken: string): Promise<object> {
    let user = this.accessTokenService.decode(accessToken);
    user = await this.usersService.getUserbyEmail(user['email']);

    await this.removeRefreshToken(user.uuid);

    return { message: 'Logout successful' };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.refreshTokenService.verify(refreshToken);
      const user = await this.usersService.getUserbyEmail(payload.uuid);
      if (user) {
        const newPayload = { email: user.email, uuid: user.uuid };
        return {
          access_token: this.accessTokenService.sign(newPayload),
        };
      }
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  async createUser(Auth: AuthUserDto): Promise<any> {
    const { email, pwd } = Auth;
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(pwd, salt);
    const user: Partial<User> = { email, hashedPwd };
    return this.usersService.createUser(user);
  }

  async setCurrentRefreshToken(
    uuid: string,
    currentHashedRefreshToken: string,
  ) {
    await this.usersService.updateUserRefreshToken(
      uuid,
      currentHashedRefreshToken,
    );
  }

  async removeRefreshToken(uuid: string) {
    return this.usersService.updateUserRefreshToken(uuid, null);
  }

  async decodeAccessToken(token: string) {
    return this.accessTokenService.decode(token);
  }

  // 이 루틴은 어디에서 처리해줘야하는가?
  // guard에서???
  // middleware에서???

  // guard에서 처리해주는거 낫겠지??

  // Access token과 Refresh token 모두가 만료된 경우 → 에러 발생 (재 로그인하여 둘다 새로 발급)
  // Access token은 유효하지만, Refresh token은 만료된 경우 → Access token을 검증하여 Refresh token 재발급
  // Access token과 Refresh token 모두가 유효한 경우 → 정상 처리
}
