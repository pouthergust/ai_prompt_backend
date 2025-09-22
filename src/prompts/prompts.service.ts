import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Prompt, PromptCategory, PromptInsert, PromptUpdate } from '../types/database.types';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient<Database>,
  ) {}

  async create(userId: string, createPromptDto: CreatePromptDto): Promise<Prompt> {
    const { data, error } = await this.supabase
      .from('prompts')
      .insert({
        title: createPromptDto.title,
        content: createPromptDto.content,
        category: createPromptDto.category,
        tags: createPromptDto.tags || [],
        is_favorite: createPromptDto.isFavorite || false,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar prompt: ${error.message}`);
    }

    return data;
  }

  async findAllByUser(userId: string): Promise<Prompt[]> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar prompts: ${error.message}`);
    }

    return data || [];
  }

  async findOneByUser(userId: string, id: string): Promise<Prompt> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Prompt not found');
    }

    return data;
  }

  async update(userId: string, id: string, updatePromptDto: UpdatePromptDto): Promise<Prompt> {
    // Primeiro verifica se o prompt existe e pertence ao usuário
    await this.findOneByUser(userId, id);

    const updateData: any = {};
    if (updatePromptDto.title !== undefined) updateData.title = updatePromptDto.title;
    if (updatePromptDto.content !== undefined) updateData.content = updatePromptDto.content;
    if (updatePromptDto.category !== undefined) updateData.category = updatePromptDto.category;
    if (updatePromptDto.tags !== undefined) updateData.tags = updatePromptDto.tags;
    if (updatePromptDto.isFavorite !== undefined) updateData.is_favorite = updatePromptDto.isFavorite;

    const { data, error } = await this.supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar prompt: ${error.message}`);
    }

    return data;
  }

  async remove(userId: string, id: string): Promise<void> {
    // Primeiro verifica se o prompt existe e pertence ao usuário
    await this.findOneByUser(userId, id);

    const { error } = await this.supabase
      .from('prompts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Erro ao deletar prompt: ${error.message}`);
    }
  }

  async search(userId: string, searchTerm: string): Promise<Prompt[]> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar prompts: ${error.message}`);
    }

    return data || [];
  }

  async findByCategory(userId: string, category: string): Promise<Prompt[]> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category as PromptCategory)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar prompts por categoria: ${error.message}`);
    }

    return data || [];
  }

  async findFavorites(userId: string): Promise<Prompt[]> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar prompts favoritos: ${error.message}`);
    }

    return data || [];
  }

  async toggleFavorite(userId: string, id: string): Promise<Prompt> {
    const prompt = await this.findOneByUser(userId, id);
    
    const { data, error } = await this.supabase
      .from('prompts')
      .update({ is_favorite: !prompt.is_favorite })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao alterar favorito: ${error.message}`);
    }

    return data;
  }
}