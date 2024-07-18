import {
  //   OrderStatus,
  //   OrderType,
  PrismaClient,
  Role,
  //   ShipmentStatus,
  //   ShipmentType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const bcryptSaltOrRound = 12;

async function main() {
  const adminPassword = await bcrypt.hash('123456a@A', bcryptSaltOrRound);

  const root = await prisma.user.upsert({
    where: { email: 'root@adlogistic.vn' },
    update: {},
    create: {
      email: 'root@adlogistic.vn',
      name: 'Root',
      role: Role.ROOT,
      password: adminPassword,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@adlogistic.vn' },
    update: {},
    create: {
      email: 'admin@adlogistic.vn',
      name: 'Admin',
      role: Role.ADMIN,
      password: adminPassword,
    },
  });

  // const manager = await prisma.user.upsert({
  //   where: { email: 'manager@ndexpress.vn' },
  //   update: {},
  //   create: {
  //     email: 'manager@ndexpress.vn',
  //     name: 'Manager',
  //     role: Role.MANAGER,
  //     password: adminPassword,
  //   },
  // });

  const zones = [
    {
      id: 1,
      name: 'Australia',
      description: 'Australia Zone',
      address: {
        name: 'AD Logistic test',
        email: 'adlogistic-test@ndexpress.com',
        phone: '0488888888',
        lines: ['46 Lucerne Street', 'Belmore'],
        suburb: 'BELMORE',
        country: 'AU',
        state: 'NSW',
        postcode: '2192',
      },
    },
    {
      id: 2,
      name: 'USA',
      description: 'USA Zone',
      address: {
        name: 'US Logistic test',
        email: 'uslogistic-test@ndexpress.com',
        phone: '0123456789',
        lines: ['123 Main Street', 'Anytown'],
        suburb: 'ANYTOWN',
        country: 'US',
        state: 'CA',
        postcode: '90001',
      },
    },
  ];

  for (const zoneData of zones) {
    const zone = await prisma.zone.upsert({
      where: {
        id: zoneData.id,
      },
      update: {},
      create: {
        name: zoneData.name,
        description: zoneData.description,
        address: {
          create: zoneData.address,
        },
      },
    });
    console.log(`Zone ${zone.name} has been upserted.`);
  }

  // const unit = await prisma.unit.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     code: 'ND01',
  //     name: 'ND01',
  //     description: 'Unit ND01',
  //     zones: {
  //       connect: {
  //         id: zone.id,
  //       },
  //     },
  //   },
  // });

  // const unitConfig = await prisma.unitConfig.upsert({
  //   where: {
  //     id: 1,
  //   },
  //   update: {},
  //   create: {
  //     unitId: unit.id,
  //     orderProcessFee: 700,
  //     accountRentFee: 0.02,
  //   },
  // });

  // const sale = await prisma.user.upsert({
  //   where: { email: 'sale@ndexpress.vn' },
  //   update: {
  //     unitId: unit.id,
  //   },
  //   create: {
  //     email: 'sale@ndexpress.vn',
  //     name: 'Sale',
  //     role: Role.SALE,
  //     password: adminPassword,
  //     unitId: unit.id,
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
