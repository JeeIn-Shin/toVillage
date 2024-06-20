import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshToken = request.cookies?.refresh_token;

        if (!refreshToken) {
          throw new UnauthorizedException('Refresh token is missing');
        }

        try {
          const newTokens = await this.authService.refreshAccessToken(
            refreshToken,
          );
          response.cookie('access_token', newTokens.access_token, {
            httpOnly: true,
          });
          request.headers.authorization = `Bearer ${newTokens.access_token}`;

          return (await super.canActivate(context)) as boolean;
        } catch (refreshError) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      }

      throw error;
    }
  }
}
