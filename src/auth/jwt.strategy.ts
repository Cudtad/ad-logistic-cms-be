import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';
import { User } from '@prisma/client';

function cookieExtractor(req: Request) {
  return req?.cookies['access-token'];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.get('security.jwtSecretKey'),
    });
  }

  async validate(payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload.id);
    if (!user || !user.isActive || user.isDeleted) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
