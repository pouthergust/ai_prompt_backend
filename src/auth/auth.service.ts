import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Database } from '../types/database.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

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

      // Inserir dados adicionais na tabela users
      if (authData.user) {
        const { error: insertError } = await this.supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email,
            name,
            password: '', // Senha é gerenciada pelo Supabase Auth
          }]);

        if (insertError) {
          console.error('Erro ao inserir usuário na tabela:', insertError);
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
      const { data, error } = await this.supabase
        .from('users')
        .select('id, name, email, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      return data;
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