import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { LocalAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() Auth: AuthUserDto): Promise<any> {
    return this.authService.loginUser(Auth);
  }

  @Post('signup')
  async singUp(@Body() user: AuthUserDto): Promise<object> {
    await this.authService.createUser(user);

    return { message: 'User registration successful' };
  }
}
