# AI Prompt Manager API

Backend em NestJS para o AI Prompt Manager - uma API REST completa para gerenciamento de prompts de IA.

## 🚀 Funcionalidades

### **Autenticação JWT**
- Registro e login de usuários
- Autenticação via JWT tokens
- Proteção de rotas com Guards
- Hash seguro de senhas com Bcrypt

### **Gerenciamento de Prompts**
- CRUD completo de prompts
- Busca por título, conteúdo e tags
- Filtros por categoria
- Sistema de favoritos
- Associação de prompts por usuário

### **API REST**
- Endpoints RESTful padronizados
- Validações robustas com class-validator
- Tratamento de erros consistente
- Suporte a CORS para frontend

## 🛠️ Stack Tecnológica

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados
- **TypeORM** - ORM para TypeScript
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Class Validator** - Validação de dados

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Configuração do Ambiente

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Configure o banco de dados:**
```bash
# O TypeORM criará as tabelas automaticamente em modo desenvolvimento
npm run start:dev
```

4. **Execute o seed (opcional):**
```bash
npm run build
node dist/scripts/seed.js
```

A API estará disponível em `http://localhost:4000/api`

## 🔗 Endpoints da API

### **Autenticação**
```
POST /api/auth/register    # Registrar usuário
POST /api/auth/login       # Login
GET  /api/auth/me         # Dados do usuário atual
```

### **Prompts** (Rotas Protegidas)
```
GET    /api/prompts                    # Listar prompts do usuário
POST   /api/prompts                    # Criar prompt
GET    /api/prompts/:id                # Obter prompt específico
PUT    /api/prompts/:id                # Atualizar prompt
DELETE /api/prompts/:id                # Deletar prompt
GET    /api/prompts/search/:term       # Buscar prompts
GET    /api/prompts/category/:category # Filtrar por categoria
GET    /api/prompts/favorites          # Listar favoritos
PATCH  /api/prompts/:id/favorite       # Toggle favorito
```

## 📋 Exemplos de Uso

### **Registro de Usuário**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### **Login**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### **Criar Prompt** (com token)
```bash
curl -X POST http://localhost:4000/api/prompts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -d '{
    "title": "Meu Prompt",
    "content": "Conteúdo do prompt...",
    "category": "Desenvolvimento",
    "tags": ["python", "código"],
    "isFavorite": false
  }'
```

## 🗄️ Estrutura do Banco de Dados

### **Tabela Users**
- `id` (UUID, PK)
- `name` (String)
- `email` (String, único)
- `password` (String)
- `created_at`, `updated_at`

### **Tabela Prompts**
- `id` (UUID, PK)
- `title` (String)
- `content` (Text)
- `category` (Enum)
- `tags` (Array de Strings)
- `is_favorite` (Boolean)
- `user_id` (UUID, FK)
- `created_at`, `updated_at`

## 🔒 Segurança

- **Autenticação JWT** com Passport
- **Hash de senhas** com Bcrypt
- **Validações** robustas com class-validator
- **Proteção CORS** configurada
- **Guards** para proteção de rotas
- **Associação por usuário** - cada usuário só acessa seus próprios dados

## 🧪 Contas de Demonstração

O seed cria automaticamente:
- **Admin**: `admin@example.com` / `admin123`
- **Usuário**: `user@example.com` / `user123`

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento
npm run start:debug        # Inicia em modo debug

# Produção
npm run build              # Build da aplicação
npm run start:prod         # Inicia em modo produção

# Testes
npm run test               # Executa testes
npm run test:watch         # Executa testes em modo watch
npm run test:cov           # Executa testes com cobertura

# Utilitários
npm run lint               # Executa linter
npm run format             # Formata código
```

## 📝 Desenvolvimento

### Estrutura do Projeto
```
src/
├── auth/                    # Módulo de autenticação
│   ├── dto/                 # DTOs de autenticação
│   ├── guards/              # Guards JWT e Local
│   ├── strategies/          # Estratégias Passport
│   ├── auth.controller.ts   # Controller de auth
│   ├── auth.service.ts      # Service de auth
│   └── auth.module.ts       # Módulo de auth
├── users/                   # Módulo de usuários
│   ├── dto/                 # DTOs de usuário
│   ├── entities/            # Entidade User
│   ├── users.service.ts     # Service de usuários
│   └── users.module.ts      # Módulo de usuários
├── prompts/                 # Módulo de prompts
│   ├── dto/                 # DTOs de prompt
│   ├── entities/            # Entidade Prompt
│   ├── prompts.controller.ts # Controller de prompts
│   ├── prompts.service.ts   # Service de prompts
│   └── prompts.module.ts    # Módulo de prompts
├── database/                # Configurações de banco
│   └── seeds/               # Seeds do banco
├── app.module.ts            # Módulo principal
└── main.ts                  # Arquivo de entrada
```

## 🔄 Integração com Frontend

Esta API foi projetada para funcionar perfeitamente com o frontend Vue.js. Configure o frontend para:

1. **Base URL**: `http://localhost:4000/api`
2. **Autenticação**: Envie o JWT no header `Authorization: Bearer TOKEN`
3. **CORS**: Já configurado para `localhost:5173` e `localhost:3000`

## 📚 Documentação Adicional

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Class Validator Documentation](https://github.com/typestack/class-validator)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.