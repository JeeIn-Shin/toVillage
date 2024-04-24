import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { UserService } from './users.service';
import { AuthUserDto } from './dto';

@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('sign-in')
  async loginUser(@Body() Auth: AuthUserDto): Promise<any> {
    const result = await this.userService.loginUser(Auth);

    if (result === -1 || result === -2)
      return {
        statusCode: HttpStatus.OK,
        detail: {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `User authentication failed`,
        },
      };
    return {
      statusCode: HttpStatus.OK,
      detail: {
        statusCode: HttpStatus.ACCEPTED,
        message: result,
      },
    };
  }
}
