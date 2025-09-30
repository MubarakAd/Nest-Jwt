/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpAuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/signup')
  async signUp(@Body() newUser: SignUpAuthDto): Promise<any> {
    return await this.authService.signUp(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any): Promise<any> {
    return await this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.userId);
  }
  @UseGuards(AuthGuard('refresh'))
  @Post('auth/refresh')
  async refreshTokens(@Request() req: any): Promise<any> {
    // console.log('req.body', req.user);

    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): any {
    return req.user;
  }
}
