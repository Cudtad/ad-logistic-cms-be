import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Config, SecurityConfig } from 'src/configuration/config.interface';

@Injectable()
export class HashService {
  constructor(private configService: ConfigService<Config>) {}

  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const saltOrRounds = securityConfig.bcryptSaltOrRound;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptSaltRounds);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
