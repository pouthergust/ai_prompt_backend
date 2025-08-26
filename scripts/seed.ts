import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Prompt } from '../src/prompts/entities/prompt.entity';
import { runSeeds } from '../src/database/seeds/seed';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'ai_prompt_manager_api_dev',
  entities: [User, Prompt],
  synchronize: true,
});

async function main() {
  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    
    await runSeeds(dataSource);
    
    await dataSource.destroy();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();