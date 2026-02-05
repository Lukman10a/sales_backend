import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_STRATEGY_ACCESS } from '../auth.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AUTH_STRATEGY_ACCESS) {}
