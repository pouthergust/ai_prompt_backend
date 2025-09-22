import { IsNotEmpty, IsString, IsEnum, IsArray, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { PromptCategory } from '../../types/database.types';

export class CreatePromptDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;

  @IsEnum(PromptCategory)
  category: PromptCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;
}