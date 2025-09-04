import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Prompt } from './src/prompts/entities/prompt.entity';

// Carrega as variáveis de ambiente
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DATABASE_PORT') || '5432'),
  username: configService.get<string>('DATABASE_USERNAME') || 'postgres',
  password: configService.get<string>('DATABASE_PASSWORD') || 'password',
  database: configService.get<string>('DATABASE_NAME') || 'ai_prompt_manager',
  entities: [User, Prompt],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
});