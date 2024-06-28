import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ListUsersQueryDto } from './dto/users-query.dto';
import { accessibleBy } from '@casl/prisma';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from 'src/auth/hash.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
  ) {}

  getUserDetail(user: User) {
    delete user.password;
    return user;
  }

  findById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findOne(user: User, id: number) {
    const where: Prisma.UserWhereUniqueInput = {
      id,
      isDeleted: false,
      role: { not: Role.ROOT },
    };

    if (user.role === Role.MANAGER) {
      where.role = Role.SALE;
    }

    return this.prismaService.user.findUnique({ where });
  }

  async create(user: User, data: CreateUserDto) {
    switch (data.role) {
      case Role.ADMIN:
        if (user.role !== Role.ROOT) {
          throw new ForbiddenException('Only root can create admin');
        }
        delete data.unitId;
        break;
      case Role.MANAGER:
        if (user.role !== Role.ADMIN) {
          throw new ForbiddenException('Only admin can create manager');
        }
        delete data.unitId;
        break;
      case Role.SALE:
        if (user.role === Role.SALE) {
          throw new ForbiddenException('Only admin or manager can create sale');
        }

        if (!data.unitId) {
          throw new BadRequestException('Unit is required');
        }

        // const unit = await this.prismaService.unit.findUnique({
        //   where: { id: data.unitId },
        // });

        // if (!unit) {
        //   throw new BadRequestException('Unit not found');
        // }
        break;
      default:
        throw new ForbiddenException();
    }

    if (await this.findByEmail(data.email)) {
      throw new BadRequestException('Email already exists');
    }

    data.password = await this.hashService.hashPassword(data.password);

    const newUser = await this.prismaService.user.create({
      data,
    });

    return this.getUserDetail(newUser);
  }

  async findAll(user: User, ability: AppAbility, query: ListUsersQueryDto) {
    const AND: Prisma.UserWhereInput[] = [
      { id: { not: user.id }, isDeleted: false, role: { not: Role.ROOT } },
    ];
    if (query.q) {
      AND.push({
        OR: [
          { email: { contains: query.q, mode: 'insensitive' } },
          { name: { contains: query.q, mode: 'insensitive' } },
        ],
      });
    }
    const where: Prisma.UserWhereInput = {
      ...accessibleBy(ability).User,
      AND,
    };

    const [total, rows] = await Promise.all([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: query.orderBy,
        // include: {
        //   unit: true,
        // },
      }),
    ]);

    return {
      rows: rows.map(this.getUserDetail),
      total,
    };
  }

  async delete(user: User, id: number) {
    if (user.id === id) {
      throw new ForbiddenException('Cannot delete yourself');
    }
    const deleteUser = await this.findById(id);
    if (!deleteUser) {
      throw new BadRequestException('User not found');
    }
    switch (deleteUser.role) {
      case Role.ADMIN:
        if (user.role !== Role.ROOT) {
          throw new ForbiddenException('Only root can delete admin');
        }
      case Role.MANAGER:
        if (user.role !== Role.ADMIN) {
          throw new ForbiddenException('Only admin can delete admin, manager');
        }
        break;
      case Role.SALE:
        break;
      default:
        throw new ForbiddenException();
    }

    return this.prismaService.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async update(user: User, id: number, data: UpdateUserDto) {
    const updateUser = await this.findById(id);
    if (!updateUser) {
      throw new BadRequestException('User not found');
    }

    switch (updateUser.role) {
      case Role.ADMIN:
        if (user.role !== Role.ROOT) {
          throw new ForbiddenException('Only root can update admin');
        }
        delete data.unitId;
        break;
      case Role.MANAGER:
        if (user.role !== Role.ADMIN) {
          throw new ForbiddenException('Only admin can update admin, manager');
        }
        delete data.unitId;
        break;
      case Role.SALE:
        break;
      default:
        throw new ForbiddenException();
    }
    // if (data.unitId) {
    //   const unit = await this.prismaService.unit.findUnique({
    //     where: { id: data.unitId },
    //   });

    //   if (!unit) {
    //     throw new BadRequestException('Unit not found');
    //   }
    // }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        name: data.name ?? updateUser.name,
        unitId: data.unitId ?? updateUser.unitId,
      },
    });

    return this.getUserDetail(updatedUser);
  }

  async updateMe(user: User, data: UpdateUserDto) {
    if (user.role !== Role.SALE) {
      delete data.unitId;
    }
    // if (data.unitId >= 0) {
    //   const unit = await this.prismaService.unit.findUnique({
    //     where: { id: data.unitId },
    //   });

    //   if (!unit) {
    //     throw new BadRequestException('Unit not found');
    //   }
    // }

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        name: data.name ?? user.name,
        unitId: data.unitId ?? user.unitId,
      },
    });

    return this.getUserDetail(updatedUser);
  }
}
