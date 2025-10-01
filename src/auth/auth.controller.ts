/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';

import { SignUpAuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from 'src/common/decorator/public.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}
  @Public()
  @Post('auth/signup')
  async signUp(
    @Body() newUser: SignUpAuthDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<any> {
    const { refresh_token, access_token, user } =
      await this.authService.signUp(newUser);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      user,
      access_token,
    };
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<any> {
    const { refresh_token, access_token, user } = await this.authService.login(
      req.user,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // console.log('login user', user);

    return {
      user,
      access_token,
    };
  }

  @Post('auth/logout')
  async logout(@Request() req: any, @Res({ passthrough: true }) res: any) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });

    await this.authService.logout(req.user.userId);
  }
  @Public()
  @UseGuards(AuthGuard('auth/refresh'))
  @Post('auth/refresh')
  async refreshTokens(
    @Request() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<any> {
    // console.log('req.body', req.user);

    const { refresh_token, access_token, user } =
      await this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      user,
      access_token,
    };
  }
  @Roles(Role.ADMIN)
  @Get('profile')
  getProfile(@Request() req: any): any {
    console.log('req.user', req.user);
    return req.user;
  }
}
