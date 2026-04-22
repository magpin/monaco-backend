import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
interface AuthenticatedRequest {
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./types/auth-response.type").AuthResponse>;
    login(loginDto: LoginDto): Promise<import("./types/auth-response.type").AuthResponse>;
    getProfile(req: AuthenticatedRequest): Promise<import("../users/types/user-response.type").UserResponse>;
}
export {};
