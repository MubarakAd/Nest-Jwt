import { AuthService } from './auth.service';
import { SignUpAuthDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(newUser: SignUpAuthDto): Promise<any>;
    login(req: any): Promise<any>;
    logout(req: any): Promise<void>;
    refreshTokens(req: any): Promise<any>;
    getProfile(req: any): any;
}
