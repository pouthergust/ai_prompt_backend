import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { LoginDto } from './dto/login.dto';
import { Database } from '../types/database.types';

interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    try {
      // Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new ConflictException('Email já está em uso');
        }
        throw new UnauthorizedException(authError.message);
      }

      // Se o usuário foi criado com sucesso, criar também na tabela public.users
      if (authData.user) {
        const { error: dbError } = await this.supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            name: name,
          });

        if (dbError) {
          console.error('Erro ao criar usuário na tabela users:', dbError);
          // Não falhar o registro se o usuário já existir na tabela
          if (!dbError.message.includes('duplicate key')) {
            throw new UnauthorizedException('Erro ao criar perfil do usuário');
          }
        }
      }

      return {
        user: authData.user,
        session: authData.session,
        message: 'Usuário registrado com sucesso',
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro interno do servidor');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      return {
        user: data.user,
        session: data.session,
        access_token: data.session?.access_token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro interno do servidor');
    }
  }

  async getProfile(userId: string) {
    try {
      // Buscar dados do usuário diretamente do Supabase Auth
      const { data: { user }, error } = await this.supabase.auth.getUser();

      if (error || !user || user.id !== userId) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || null,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro interno do servidor');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return null;
      }

      return data.user;
    } catch (error) {
      return null;
    }
  }

  async logout(accessToken: string) {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        throw new UnauthorizedException('Erro ao fazer logout');
      }

      return { message: 'Logout realizado com sucesso' };
    } catch (error) {
      throw new UnauthorizedException('Erro interno do servidor');
    }
  }
}