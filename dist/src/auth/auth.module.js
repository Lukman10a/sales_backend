"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const roles_guard_1 = require("../common/guards/roles.guard");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_access_strategy_1 = require("./strategies/jwt-access.strategy");
const jwt_refresh_strategy_1 = require("./strategies/jwt-refresh.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ session: false }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => {
                    const expiresIn = config.get('JWT_ACCESS_EXPIRES_IN') ?? '15m';
                    return {
                        secret: config.get('JWT_ACCESS_SECRET'),
                        signOptions: {
                            expiresIn: expiresIn,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => [
                    {
                        ttl: Math.max(1, Math.ceil((config.get('RATE_LIMIT_WINDOW_MS') ?? 60_000) / 1000)),
                        limit: config.get('RATE_LIMIT_MAX') ?? 100,
                    },
                ],
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_access_strategy_1.JwtAccessStrategy, jwt_refresh_strategy_1.JwtRefreshStrategy, roles_guard_1.RolesGuard],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map