import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Prompt, PromptCategory } from './entities/prompt.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private promptsRepository: Repository<Prompt>,
  ) {}

  async create(userId: string, createPromptDto: CreatePromptDto): Promise<Prompt> {
    const prompt = this.promptsRepository.create({
      ...createPromptDto,
      userId,
    });

    return this.promptsRepository.save(prompt);
  }

  async findAllByUser(userId: string): Promise<Prompt[]> {
    return this.promptsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByUser(userId: string, id: string): Promise<Prompt> {
    const prompt = await this.promptsRepository.findOne({
      where: { id, userId },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return prompt;
  }

  async update(userId: string, id: string, updatePromptDto: UpdatePromptDto): Promise<Prompt> {
    const prompt = await this.findOneByUser(userId, id);
    
    Object.assign(prompt, updatePromptDto);
    
    return this.promptsRepository.save(prompt);
  }

  async remove(userId: string, id: string): Promise<void> {
    const prompt = await this.findOneByUser(userId, id);
    await this.promptsRepository.remove(prompt);
  }

  async search(userId: string, searchTerm: string): Promise<Prompt[]> {
    return this.promptsRepository
      .createQueryBuilder('prompt')
      .where('prompt.userId = :userId', { userId })
      .andWhere(
        '(prompt.title ILIKE :searchTerm OR prompt.content ILIKE :searchTerm OR :searchTerm = ANY(prompt.tags))',
        { searchTerm: `%${searchTerm}%` }
      )
      .orderBy('prompt.createdAt', 'DESC')
      .getMany();
  }

  async findByCategory(userId: string, category: PromptCategory): Promise<Prompt[]> {
    return this.promptsRepository.find({
      where: { userId, category },
      order: { createdAt: 'DESC' },
    });
  }

  async findFavorites(userId: string): Promise<Prompt[]> {
    return this.promptsRepository.find({
      where: { userId, isFavorite: true },
      order: { createdAt: 'DESC' },
    });
  }

  async toggleFavorite(userId: string, id: string): Promise<Prompt> {
    const prompt = await this.findOneByUser(userId, id);
    prompt.isFavorite = !prompt.isFavorite;
    return this.promptsRepository.save(prompt);
  }
}