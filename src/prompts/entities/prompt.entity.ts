import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PromptCategory {
  DESENVOLVIMENTO = 'Desenvolvimento',
  MARKETING = 'Marketing',
  CRIATIVIDADE = 'Criatividade',
  ANALISE = 'Análise',
  EDUCACAO = 'Educação',
  NEGOCIOS = 'Negócios',
  OUTROS = 'Outros',
}

@Entity('prompts')
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PromptCategory,
  })
  category: PromptCategory;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.prompts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}