import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ListZonesQueryDto } from './dto/units-query.dto';
import { Prisma } from '@prisma/client';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class ZonesService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(query: ListZonesQueryDto) {
    const where: Prisma.ZoneWhereInput = {};

    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }

    const [rows, total] = await Promise.all([
      this.prismaService.zone.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: query.orderBy,
        include: {
          address: true,
        },
      }),
      this.prismaService.zone.count({ where }),
    ]);

    return {
      rows,
      total,
    };
  }

  public async create(data: CreateZoneDto) {
    return this.prismaService.zone.create({
      data: {
        name: data.name,
        description: data.description,
        address: {
          create: data.address,
        },
      },
      include: {
        address: true,
      },
    });
  }

  public async update(id: number, data: UpdateZoneDto) {
    const zone = await this.prismaService.zone.findUnique({
      where: { id },
    });

    if (!zone) {
      throw new Error('Zone not found');
    }

    const updateData: Prisma.ZoneUpdateInput = {
      name: data.name ?? zone.name,
      description: data.description ?? zone.description,
    };

    if (data.address) {
      updateData.address = {
        upsert: {
          where: { zoneId: zone.id },
          update: data.address,
          create: data.address,
        },
      };
    }

    return this.prismaService.zone.update({
      where: { id },
      data: updateData,
      include: {
        address: true,
      },
    });
  }
}
