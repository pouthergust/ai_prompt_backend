import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ClerkStrategy } from './strategies/clerk.strategy';
import { ClerkClientProvider } from '../providers/clerk-client.provider';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ClerkStrategy, ClerkClientProvider],
})
export class AuthModule {}