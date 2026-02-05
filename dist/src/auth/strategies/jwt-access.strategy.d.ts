import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload';
declare const JwtAccessStrategy_base: new (...args: any) => any;
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): JwtPayload;
}
export {};
