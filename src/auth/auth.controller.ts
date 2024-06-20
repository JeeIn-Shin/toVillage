import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { LocalAuthGuard, JwtAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() Auth: AuthUserDto): Promise<any> {
    const user = await this.authService.validateUser(Auth);

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.loginUser(user);

    await this.authService.setCurrentRefreshToken(
      user.uuid,
      tokens.refresh_token,
    );

    return tokens;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutUser(@Request() req) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.authService.logoutUser(accessToken);
  }

  @Post('signup')
  async singUp(@Body() user: AuthUserDto): Promise<object> {
    await this.authService.createUser(user);

    return { message: 'User registration successful' };
  }
}
