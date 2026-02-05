import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload';
declare const JwtRefreshStrategy_base: new (...args: any) => any;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(configService: ConfigService);
    validate(req: Request, payload: JwtPayload): JwtPayload & {
        refreshToken: string;
    };
}
export {};
