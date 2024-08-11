

import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from '@/users/users.service';
import { ResetToken } from './entities/reset-token.entity';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([User, RefreshToken, ResetToken]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService, ConfigService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }

