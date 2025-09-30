/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInAuthDto, SignUpAuthDto } from './auth.dto';
import { Token } from './types/token.types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp(user: SignUpAuthDto): Promise<Token & { user: any }> {
    const checkUser = await this.userService.findOne(user.email);
    if (checkUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const newUser = await this.userService.create(user);
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    const upDatedUser = await this.userService.findById(newUser.id);
    const { password, hashedRt, ...result } = upDatedUser;
    return {
      user: result,
      ...tokens,
    };
  }
  async login(user: any): Promise<Token & { user: any }> {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    const { password, hashedRt, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }
  async logout(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });
  }
  async refreshTokens(userId: string, rt: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashedRt) {
      throw new BadRequestException('Access Denied');
    }
    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) {
      throw new BadRequestException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    const { password, hashedRt, ...result } = user;
    return {
      user: result,
      ...tokens,
    };
  }
  async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return {
      access_token,
      refresh_token,
    };
  }
  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const hashedToken = await this.hashPassword(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hashedToken },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  async validateUser(email: string, pass: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.userService.findOne(email);
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    if (bcrypt.compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
