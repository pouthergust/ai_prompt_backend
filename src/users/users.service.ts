import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { Database, User } from '../types/database.types';

@Injectable()
export class UsersService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        name: createUserDto.name,
        email: createUserDto.email,
        password: '', // Senha é gerenciada pelo Supabase Auth
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }

    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    // Com Supabase Auth, a validação de senha é feita pelo próprio Supabase
    // Este método é mantido para compatibilidade, mas não é mais usado
    return false;
  }
}