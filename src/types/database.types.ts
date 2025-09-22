export enum PromptCategory {
  DESENVOLVIMENTO = 'Desenvolvimento',
  MARKETING = 'Marketing',
  CRIATIVIDADE = 'Criatividade',
  ANALISE = 'Análise',
  EDUCACAO = 'Educação',
  NEGOCIOS = 'Negócios',
  OUTROS = 'Outros',
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          password?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          id: string
          title: string
          content: string
          category: PromptCategory
          tags: string[]
          is_favorite: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: PromptCategory
          tags?: string[]
          is_favorite?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: PromptCategory
          tags?: string[]
          is_favorite?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type PromptInsert = Database['public']['Tables']['prompts']['Insert'];
export type PromptUpdate = Database['public']['Tables']['prompts']['Update'];

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];