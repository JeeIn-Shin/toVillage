import { Controller, UseGuards, Put, Request, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { UpdateUserDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const accessToken = req.headers.authorization.split(' ')[1];

    return this.userService.updateUserProfile(accessToken, updateUserDto);
  }
}
