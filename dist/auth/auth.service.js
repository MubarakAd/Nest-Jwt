"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    prisma;
    constructor(userService, jwtService, prisma) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async signUp(user) {
        const checkUser = await this.userService.findOne(user.email);
        if (checkUser) {
            throw new common_1.BadRequestException('User with this email already exists');
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
    async login(user) {
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        const { password, hashedRt, ...result } = user;
        return {
            user: result,
            ...tokens,
        };
    }
    async logout(userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRt: null },
        });
    }
    async refreshTokens(userId, rt) {
        const user = await this.userService.findById(userId);
        if (!user || !user.hashedRt) {
            throw new common_1.BadRequestException('Access Denied');
        }
        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches) {
            throw new common_1.BadRequestException('Access Denied');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        const { password, hashedRt, ...result } = user;
        return {
            user: result,
            ...tokens,
        };
    }
    async getTokens(userId, email) {
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
    async updateRefreshToken(userId, refreshToken) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const hashedToken = await this.hashPassword(refreshToken);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRt: hashedToken },
        });
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }
    async validateUser(email, pass) {
        const user = await this.userService.findOne(email);
        if (!user) {
            return null;
        }
        if (bcrypt.compareSync(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map