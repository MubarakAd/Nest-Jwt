import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpAuthDto } from './auth.dto';
import { Token } from './types/token.types';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private readonly userService;
    private jwtService;
    private prisma;
    constructor(userService: UsersService, jwtService: JwtService, prisma: PrismaService);
    signUp(user: SignUpAuthDto): Promise<Token & {
        user: any;
    }>;
    login(user: any): Promise<Token & {
        user: any;
    }>;
    logout(userId: string): Promise<void>;
    refreshTokens(userId: string, rt: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: any;
    }>;
    getTokens(userId: number, email: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    hashPassword(password: string): Promise<string>;
    validateUser(email: string, pass: string): Promise<any>;
}
