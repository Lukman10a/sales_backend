import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SaleOrdersModule } from './sale-orders/sale-orders.module';
import { ReportsModule } from './reports/reports.module';
import { BackupsModule } from './backups/backups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    SaleOrdersModule,
    ReportsModule,
    BackupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
