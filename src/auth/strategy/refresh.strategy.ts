/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'secretKey',
      passReqToCallback: true, // ✅ allows req in validate
    });
  }

  async validate(req: Request, payload: any) {
    // Extract Authorization header (Bearer <token>)
    const authHeader = req?.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Refresh token malformed');
    }

    // Remove "Bearer " and trim spaces
    const refreshToken = authHeader.split(' ')[1];

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token missing');
    }

    // Attach refreshToken with payload
    return {
      ...payload,
      refreshToken,
    };
  }
}
