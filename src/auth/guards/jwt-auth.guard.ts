/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add logging for debugging
    const request = context.switchToHttp().getRequest();
    console.log(`Protected route hit: ${request.url}`);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('❌ Token expired. Please log in again.');
    }
    if (err || !user) {
      throw err || new UnauthorizedException('❌ Invalid token provided.');
    }

    // Example: ban check
    if (user.isBanned) {
      throw new UnauthorizedException('🚫 Your account is banned.');
    }

    return user; // authenticated user goes forward
  }
}
