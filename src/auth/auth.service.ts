import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { ClerkClient } from '@clerk/backend';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('CLERK_CLIENT') private clerkClient: ClerkClient,
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

  async getClerkUserProfile(clerkUserId: string) {
    try {
      // Obter informações do usuário do Clerk
      const clerkUser = await this.clerkClient.users.getUser(clerkUserId);
      
      // Verificar se o usuário existe no banco de dados local
      let user = await this.usersService.findByEmail(clerkUser.emailAddresses[0].emailAddress);
      
      // Se o usuário não existir, crie um novo
      if (!user) {
        const createUserDto = new CreateUserDto();
        createUserDto.email = clerkUser.emailAddresses[0].emailAddress;
        createUserDto.name = `${clerkUser.firstName} ${clerkUser.lastName}`;
        createUserDto.password = Math.random().toString(36).slice(-8); // Senha aleatória
        
        user = await this.usersService.create(createUserDto);
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return {
        data: {
          ...userWithoutPassword,
          clerkId: clerkUser.id,
          clerkData: {
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl,
          }
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Clerk user');
    }
  }
}