import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import {
  User,
  Role,
  Unit,
  Zone,
  Image,
  Order,
  Notification,
  // OrderStatus,
  // NotificationStatus,
} from '@prisma/client';
import { Action, OrderAction } from './casl.constants';

type TSubjects =
  | Subjects<{
      User: User;
      Unit: Unit;
      Zone: Zone;
      Image: Image;
      Order: Order;
      Notification: Notification;
    }>
  | 'all'
  | 'Analytics';

export type AppAbility = PureAbility<
  [Action | OrderAction, TSubjects],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    switch (user.role) {
      case Role.ROOT:
      case Role.ADMIN:
        can(Action.Manage, 'all');
        break;
      case Role.MANAGER:
        // can(Action.Manage, 'User', { role: Role.SALE });
        can(Action.Read, 'User', { role: Role.SALE });
        // can(Action.Read, 'Zone');
        // can(Action.Read, 'Unit');
        // can(Action.Update, 'Order', { status: OrderStatus.PENDING });
        // can(Action.Read, 'Order');
        // can(OrderAction.APPROVE, 'Order');
        // can(OrderAction.REJECT, 'Order');
        break;
      case Role.SALE:
        // can(Action.Read, 'Order', { unitId: user.unitId, createdBy: user.id });
        // can(Action.Create, 'Order');
        // can(Action.Update, 'Order', {
        //   createdBy: user.id,
        //   status: {
        //     in: [OrderStatus.PENDING, OrderStatus.REJECTED],
        //   },
        // });
        break;
      default:
        break;
    }

    return build();
  }
}
