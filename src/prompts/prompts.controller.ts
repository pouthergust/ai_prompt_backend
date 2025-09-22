import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { PromptCategory } from '../types/database.types';

@Controller('prompts')
@UseGuards(SupabaseAuthGuard)
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  create(@Request() req, @Body() createPromptDto: CreatePromptDto) {
    return this.promptsService.create(req.user.id, createPromptDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.promptsService.findAllByUser(req.user.id);
  }

  @Get('search/:term')
  search(@Request() req, @Param('term') term: string) {
    return this.promptsService.search(req.user.id, term);
  }

  @Get('category/:category')
  findByCategory(@Request() req, @Param('category') category: PromptCategory) {
    return this.promptsService.findByCategory(req.user.id, category);
  }

  @Get('favorites')
  findFavorites(@Request() req) {
    return this.promptsService.findFavorites(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.promptsService.findOneByUser(req.user.id, id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updatePromptDto: UpdatePromptDto) {
    return this.promptsService.update(req.user.id, id, updatePromptDto);
  }

  @Patch(':id/favorite')
  toggleFavorite(@Request() req, @Param('id') id: string) {
    return this.promptsService.toggleFavorite(req.user.id, id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.promptsService.remove(req.user.id, id);
  }
}