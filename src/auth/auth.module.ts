import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy, JwtStrategy } from './strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '60s',
      },
    }),
    JwtModule.register({
      secret: jwtConstants.refreshSecret,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: 'ACCESS_TOKEN_SERVICE',
      useExisting: JwtService,
    },
    {
      provide: 'REFRESH_TOKEN_SERVICE',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (jwtService: JwtService) => {
        return new JwtService({
          secret: jwtConstants.refreshSecret,
          signOptions: { expiresIn: '7d' },
        });
      },
      inject: [JwtService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
