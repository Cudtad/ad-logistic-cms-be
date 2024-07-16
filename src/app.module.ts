import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configuration/config';
import { ThrottlerModule } from '@nestjs/throttler';
// import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CaslModule } from './casl/casl.module';
// import { UnitsModule } from './units/units.module';
// import { ZonesModule } from './zones/zones.module';
// import { AuspostModule } from './auspost/auspost.module';
// import { OrdersModule } from './orders/orders.module';
// import { StorageModule } from './storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Config, Environment } from './configuration/config.interface';
import { UnitModule } from './unit/unit.module';
import { ZonesModule } from './zones/zones.module';
// import { AnalyticsModule } from './analytics/analytics.module';
// import { Config, Environment } from './configuration/config.interface';
// import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ScheduleModule.forRoot(),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService<Config>) => {
        const isDevelopement =
          configService.get<Environment>('environment') === 'development';

        return {
          prismaOptions: {
            log: isDevelopement
              ? ['query', 'info', 'warn', 'error']
              : ['warn', 'error'],
          },
          middlewares: [
            // configure your prisma middleware
            loggingMiddleware({
              logger: new Logger('PrismaMiddleware'),
              logLevel: 'log',
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    CaslModule,
    // HealthModule,
    AuthModule,
    UsersModule,
    CaslModule,
    UnitModule,
    ZonesModule,
    // AuspostModule,
    // OrdersModule,
    // StorageModule,
    // AnalyticsModule,
    // NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
