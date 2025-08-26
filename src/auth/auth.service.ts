import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await this.usersService.validatePassword(user, password)) {
      return user;
    }
    
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.create(createUserDto);
    
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      data: {
        user: userWithoutPassword,
        token,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      data: userWithoutPassword,
    };
  }
}