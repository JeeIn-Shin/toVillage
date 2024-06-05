import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy, JwtStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/users.module';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config/configuration';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: config().secret,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
