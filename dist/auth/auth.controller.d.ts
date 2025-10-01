import { AuthService } from './auth.service';
import { SignUpAuthDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthController {
    private readonly authService;
    private prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    signUp(newUser: SignUpAuthDto, res: any): Promise<any>;
    login(req: any, res: any): Promise<any>;
    logout(req: any, res: any): Promise<void>;
    refreshTokens(req: any, res: any): Promise<any>;
    getProfile(req: any): any;
}
