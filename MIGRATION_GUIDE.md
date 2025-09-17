# Guia de Migração para Supabase

Este documento descreve as mudanças realizadas para migrar a aplicação do PostgreSQL tradicional com TypeORM para o Supabase.

## 📋 Resumo das Mudanças

### 1. Dependências Instaladas

- `@supabase/supabase-js`: Cliente oficial do Supabase

### 2. Arquivos Criados

#### Configuração do Supabase

- `src/config/supabase.config.ts`: Funções para criar clientes Supabase
- `src/supabase/supabase.module.ts`: Módulo global do Supabase
- `src/types/database.types.ts`: Tipos TypeScript para as tabelas

#### Autenticação

- `src/auth/guards/supabase-auth.guard.ts`: Guard de autenticação para Supabase

#### Schema do Banco

- `supabase-schema.sql`: Script SQL para criar as tabelas no Supabase

### 3. Arquivos Modificados

#### Configuração Principal

- `src/app.module.ts`: Removido TypeORM, adicionado SupabaseModule
- `.env`: Adicionadas variáveis do Supabase
- `docker-compose.yml`: Removido PostgreSQL local

#### Services Migrados

- `src/auth/auth.service.ts`: Migrado para Supabase Auth
- `src/users/users.service.ts`: Migrado para cliente Supabase
- `src/prompts/prompts.service.ts`: Migrado para cliente Supabase

#### Módulos Atualizados

- `src/users/users.module.ts`: Removido TypeORM
- `src/prompts/prompts.module.ts`: Removido TypeORM

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Database URLs (fornecidas pelo Supabase)
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:[PASSWORD]@xxx.pooler.supabase.com:5432/postgres
```

### 2. Configuração do Banco de Dados

Execute o script `supabase-schema.sql` no seu projeto Supabase para criar:

- Tabelas `users` e `prompts`
- Índices para performance
- Políticas de Row Level Security (RLS)
- Triggers para `updated_at`

## 🔄 Principais Mudanças na Arquitetura

### Autenticação

- **Antes**: JWT personalizado com bcrypt
- **Depois**: Supabase Auth com tokens JWT nativos

### Banco de Dados

- **Antes**: TypeORM com repositórios
- **Depois**: Cliente Supabase com queries diretas

### Segurança

- **Antes**: Validação manual de usuários
- **Depois**: Row Level Security (RLS) do Supabase

## 🚀 Como Executar

1. Configure as variáveis de ambiente
2. Execute o schema SQL no Supabase
3. Instale as dependências: `pnpm install`
4. Execute a aplicação: `pnpm run start:dev`

## 📝 Notas Importantes

- As senhas agora são gerenciadas pelo Supabase Auth
- O RLS garante que usuários só acessem seus próprios dados
- Os tipos TypeScript foram atualizados para refletir o schema do Supabase
- O Docker Compose foi simplificado (sem PostgreSQL local)

## 🔍 Validação

Para validar se a migração foi bem-sucedida:

1. Teste o registro de usuários
2. Teste o login
3. Teste as operações CRUD de prompts
4. Verifique se o RLS está funcionando corretamente
