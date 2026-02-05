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
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../prisma/prisma.service");
const auth_constants_1 = require("./auth.constants");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signup(dto, res) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already exists');
        }
        const passwordHash = await argon2.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: dto.role,
                businessName: dto.businessName,
                investorId: dto.investorId,
                avatarUrl: dto.avatarUrl,
                lastActive: new Date(),
            },
        });
        return this.issueTokensAndRespond(user, res, dto.rememberMe === true);
    }
    async login(dto, res) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await argon2.verify(user.passwordHash, dto.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (dto.role && dto.role !== user.role) {
            throw new common_1.ForbiddenException('Role does not match this account');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() },
        });
        return this.issueTokensAndRespond(user, res, dto.rememberMe === true);
    }
    async refresh(payload, res) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const valid = payload.refreshToken &&
            (await argon2.verify(user.refreshTokenHash, payload.refreshToken));
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return this.issueTokensAndRespond(user, res, false);
    }
    async logout(userId, res) {
        await this.prisma.user
            .update({ where: { id: userId }, data: { refreshTokenHash: null } })
            .catch(() => undefined);
        this.clearAuthCookies(res);
        return { success: true };
    }
    async issueTokensAndRespond(user, res, rememberMe) {
        const tokens = this.signTokens(user, rememberMe);
        const refreshHash = await argon2.hash(tokens.refreshToken);
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash: refreshHash, lastActive: new Date() },
        });
        this.setAuthCookies(res, tokens, rememberMe);
        return {
            user: this.toPublicUser(updatedUser),
            accessToken: tokens.accessToken,
        };
    }
    signTokens(user, rememberMe) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessExpiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN') ?? '15m';
        const refreshExpiresBase = this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';
        const rememberDays = this.configService.get('REMEMBER_ME_DAYS') ?? 14;
        const refreshExpiresIn = rememberMe
            ? `${rememberDays}d`
            : refreshExpiresBase;
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: accessExpiresIn,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: refreshExpiresIn,
        });
        return { accessToken, refreshToken };
    }
    setAuthCookies(res, tokens, rememberMe) {
        const secure = this.configService.get('NODE_ENV') === 'production';
        const accessMaxAge = this.parseDuration(this.configService.get('JWT_ACCESS_EXPIRES_IN') ?? '15m', 15 * 60 * 1000);
        const rememberDays = this.configService.get('REMEMBER_ME_DAYS') ?? 14;
        const refreshValue = rememberMe
            ? `${rememberDays}d`
            : (this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d');
        const refreshMaxAge = this.parseDuration(refreshValue, 7 * 24 * 60 * 60 * 1000);
        res.cookie(auth_constants_1.ACCESS_TOKEN_COOKIE, tokens.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
            maxAge: accessMaxAge,
        });
        res.cookie(auth_constants_1.REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
            maxAge: refreshMaxAge,
        });
    }
    clearAuthCookies(res) {
        const secure = this.configService.get('NODE_ENV') === 'production';
        res.clearCookie(auth_constants_1.ACCESS_TOKEN_COOKIE, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
        });
        res.clearCookie(auth_constants_1.REFRESH_TOKEN_COOKIE, {
            httpOnly: true,
            sameSite: 'lax',
            secure,
            path: '/',
        });
    }
    toPublicUser(user) {
        const { passwordHash, refreshTokenHash, ...rest } = user;
        return {
            ...rest,
            displayName: `${user.firstName} ${user.lastName}`.trim(),
        };
    }
    parseDuration(value, fallbackMs) {
        const match = /^([0-9]+)([smhd])$/.exec(value.trim());
        if (!match) {
            return fallbackMs;
        }
        const amount = Number(match[1]);
        const unit = match[2];
        const msByUnit = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return amount * msByUnit[unit] || fallbackMs;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map