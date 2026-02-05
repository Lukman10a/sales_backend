import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_COOKIE, AUTH_STRATEGY_ACCESS } from '../auth.constants';
import { JwtPayload } from '../types/jwt-payload';

function cookieExtractor(cookieName: string) {
  return (req: any): string | null => {
    if (req?.cookies && req.cookies[cookieName]) {
      return req.cookies[cookieName];
    }
    return null;
  };
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  AUTH_STRATEGY_ACCESS,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(ACCESS_TOKEN_COOKIE),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
