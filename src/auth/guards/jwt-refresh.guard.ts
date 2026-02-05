import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY_REFRESH } from '../auth.constants';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(AUTH_STRATEGY_REFRESH) {}
