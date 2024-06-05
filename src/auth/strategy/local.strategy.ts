import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthUserDto } from '../dto/auth-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // 사용자가 로그인 폼에서 입력할 필드 이름
      passwordField: 'pwd',
    });
  }

  async validate(email: string, pwd: string): Promise<any> {
    const authUserDto: AuthUserDto = { email, pwd }; // DTO로 매핑
    const user = await this.authService.validateUser(authUserDto);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
