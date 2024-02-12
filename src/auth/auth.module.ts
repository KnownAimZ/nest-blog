import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { User } from 'user/entities';
import { MailModule } from 'mail';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingService, ScryptService } from 'auth/hashing';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: ScryptService,
    },
    ScryptService,
  ],
})
export class AuthModule {}
