export enum PromptCategory {
  DESENVOLVIMENTO = 'Desenvolvimento',
  MARKETING = 'Marketing',
  CRIATIVIDADE = 'Criatividade',
  ANALISE = 'Análise',
  EDUCACAO = 'Educação',
  NEGOCIOS = 'Negócios',
  OUTROS = 'Outros',
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  is_favorite: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}