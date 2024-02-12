import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'user';
import { AuthModule } from 'auth';
import { MailModule } from 'mail';
import { ProductsModule } from 'products';
import { CategoriesModule } from 'categories';
import { CartModule } from 'cart';
import typeorm from 'config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'auth/config/jwt.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from 'auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    JwtModule.registerAsync({
      global: true,
      ...jwtConfig.asProvider(),
    }),
    ConfigModule.forFeature(jwtConfig),
    UserModule,
    AuthModule,
    MailModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
