import { User } from '@prisma/client';
import { Request } from 'express';
import { AppAbility } from 'src/casl/casl-ability.factory';

export interface UserAuthRequest extends Request {
  user: User;
}

export interface UserAbilityRequest extends UserAuthRequest {
  ability: AppAbility;
}
