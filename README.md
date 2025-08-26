# AI Prompt Manager API

Backend em Elixir/Phoenix para o AI Prompt Manager - uma API REST completa para gerenciamento de prompts de IA.

## 🚀 Funcionalidades

### **Autenticação JWT**
- Registro e login de usuários
- Autenticação via JWT tokens
- Proteção de rotas com Guardian
- Hash seguro de senhas com Bcrypt

### **Gerenciamento de Prompts**
- CRUD completo de prompts
- Busca por título, conteúdo e tags
- Filtros por categoria
- Sistema de favoritos
- Associação de prompts por usuário

### **API REST**
- Endpoints RESTful padronizados
- Validações robustas com Ecto
- Tratamento de erros consistente
- Suporte a CORS para frontend

## 🛠️ Stack Tecnológica

- **Elixir** ~> 1.14
- **Phoenix** ~> 1.7.10
- **PostgreSQL** como banco de dados
- **Guardian** para autenticação JWT
- **Bcrypt** para hash de senhas
- **CORS Plug** para integração com frontend

## 📦 Instalação e Configuração

### Pré-requisitos
- Elixir 1.14+
- PostgreSQL 12+
- Mix (gerenciador de dependências do Elixir)

### Configuração do Ambiente

1. **Clone e configure o projeto:**
```bash
cd ai_prompt_manager_api
mix deps.get
```

2. **Configure o banco de dados:**
```bash
# Edite config/dev.exs com suas credenciais do PostgreSQL
mix ecto.create
mix ecto.migrate
mix run priv/repo/seeds.exs
```

3. **Inicie o servidor:**
```bash
mix phx.server
```

A API estará disponível em `http://localhost:4000`

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
    "user": {
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "senha123"
    }
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
    "prompt": {
      "title": "Meu Prompt",
      "content": "Conteúdo do prompt...",
      "category": "Desenvolvimento",
      "tags": ["python", "código"],
      "is_favorite": false
    }
  }'
```

## 🗄️ Estrutura do Banco de Dados

### **Tabela Users**
- `id` (UUID, PK)
- `name` (String)
- `email` (String, único)
- `password_hash` (String)
- `inserted_at`, `updated_at`

### **Tabela Prompts**
- `id` (UUID, PK)
- `title` (String)
- `content` (Text)
- `category` (String)
- `tags` (Array de Strings)
- `is_favorite` (Boolean)
- `user_id` (UUID, FK)
- `inserted_at`, `updated_at`

## 🔒 Segurança

- **Autenticação JWT** com Guardian
- **Hash de senhas** com Bcrypt
- **Validações** robustas nos modelos
- **Proteção CORS** configurada
- **Associação por usuário** - cada usuário só acessa seus próprios dados

## 🧪 Contas de Demonstração

O seed cria automaticamente:
- **Admin**: `admin@example.com` / `admin123`
- **Usuário**: `user@example.com` / `user123`

## 🚀 Deploy

### Configuração de Produção
1. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `SECRET_KEY_BASE`
   - `GUARDIAN_SECRET_KEY`

2. Execute as migrações:
```bash
mix ecto.migrate
```

3. Inicie a aplicação:
```bash
mix phx.server
```

## 📝 Desenvolvimento

### Comandos Úteis
```bash
# Executar testes
mix test

# Console interativo
iex -S mix

# Resetar banco de dados
mix ecto.reset

# Gerar nova migração
mix ecto.gen.migration nome_da_migracao
```

### Estrutura do Projeto
```
lib/
├── ai_prompt_manager_api/          # Contextos de negócio
│   ├── accounts/                   # Usuários
│   ├── prompts/                    # Prompts
│   └── guardian.ex                 # Configuração JWT
├── ai_prompt_manager_api_web/      # Camada web
│   ├── controllers/                # Controllers
│   ├── router.ex                   # Rotas
│   └── endpoint.ex                 # Configuração HTTP
priv/
├── repo/
│   ├── migrations/                 # Migrações do banco
│   └── seeds.exs                   # Dados iniciais
```

## 🔄 Integração com Frontend

Esta API foi projetada para funcionar perfeitamente com o frontend Vue.js. Configure o frontend para:

1. **Base URL**: `http://localhost:4000/api`
2. **Autenticação**: Envie o JWT no header `Authorization: Bearer TOKEN`
3. **CORS**: Já configurado para `localhost:5173` e `localhost:3000`

## 📚 Documentação Adicional

- [Phoenix Framework](https://phoenixframework.org/)
- [Ecto Documentation](https://hexdocs.pm/ecto/)
- [Guardian Authentication](https://hexdocs.pm/guardian/)
- [Elixir Getting Started](https://elixir-lang.org/getting-started/introduction.html)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.