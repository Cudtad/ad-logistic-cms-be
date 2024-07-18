import { Prisma, Unit } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ListUnitsQueryDto } from './dto/unit-query.dto';

@Injectable()
export class UnitService {
  constructor(private readonly prismaService: PrismaService) {}

  getUnitDetail(unit: Unit) {
    return unit;
  }

  findById(id: number): Promise<Unit | null> {
    return this.prismaService.unit.findUnique({ where: { id } });
  }

  public async create(data: CreateUnitDto) {
    const existed = await this.prismaService.unit.findUnique({
      where: { code: data.code },
      select: {
        id: true,
      },
    });

    if (existed) {
      throw new BadRequestException('Unit code existed');
    }

    const zones = await this.prismaService.zone.findMany({
      where: {
        id: {
          in: data.zoneIds,
        },
      },
    });

    if (zones.length === 0) {
      throw new Error('Zones not found');
    }

    return this.prismaService.unit.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        zones: {
          connect: zones.map((zone) => ({ id: zone.id })),
        },
        unitConfig: {
          create: {
            orderProcessFee: data.config.orderProcessFee,
            accountRentFee: data.config.accountRentFee,
          },
        },
      },
    });
  }

  public async update(id: number, data: UpdateUnitDto) {
    const unit = await this.prismaService.unit.findUnique({
      where: { id },
    });
    if (!unit) {
      throw new Error('Unit not found');
    }
    if (data.config) {
      await this.prismaService.unitConfig.upsert({
        where: {
          unitId: id,
        },
        create: {
          unitId: id,
          orderProcessFee: data.config.orderProcessFee,
          accountRentFee: data.config.accountRentFee,
        },
        update: {
          orderProcessFee: data.config.orderProcessFee,
          accountRentFee: data.config.accountRentFee,
        },
      });
    }

    const zones = await this.prismaService.zone.findMany({
      where: {
        id: {
          in: data.zoneIds,
        },
      },
    });

    const updatedUnit = await this.prismaService.unit.update({
      where: { id },
      data: {
        name: data.name ?? unit.name,
        description: data.description ?? unit.description,
        zones: {
          set: zones.map((zone) => ({ id: zone.id })),
        },
      },
      include: {
        zones: true,
        unitConfig: true,
      },
    });

    return updatedUnit;
  }

  async findAll(query: ListUnitsQueryDto) {
    const where: Prisma.UnitWhereInput = { isDeleted: false };
    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }

    if (query.zoneId) {
      where.zones = {
        some: {
          id: query.zoneId,
        },
      };
    }

    const [rows, total] = await Promise.all([
      this.prismaService.unit.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: query.orderBy,
        include: {
          zones: true,
        },
      }),
      this.prismaService.unit.count({ where }),
    ]);

    return {
      rows,
      total,
    };
  }

  async delete(id: number) {
    const deleteUnit = await this.findById(id);
    if (!deleteUnit) {
      throw new BadRequestException('Unit not found');
    }

    return this.prismaService.unit.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
