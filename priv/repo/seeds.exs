# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     AiPromptManagerApi.Repo.insert!(%AiPromptManagerApi.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias AiPromptManagerApi.Accounts
alias AiPromptManagerApi.Prompts

# Create demo users
{:ok, admin_user} = Accounts.create_user(%{
  name: "Administrador",
  email: "admin@example.com",
  password: "admin123"
})

{:ok, regular_user} = Accounts.create_user(%{
  name: "Usuário",
  email: "user@example.com", 
  password: "user123"
})

# Create sample prompts for admin user
Prompts.create_prompt(admin_user.id, %{
  title: "Análise de Código Python",
  content: "Analise o seguinte código Python e forneça feedback sobre: 1) Qualidade do código, 2) Possíveis melhorias, 3) Bugs potenciais, 4) Padrões de design:\n\n[CÓDIGO]",
  category: "Desenvolvimento",
  tags: ["python", "análise", "código"],
  is_favorite: true
})

Prompts.create_prompt(admin_user.id, %{
  title: "Criação de Post para Instagram",
  content: "Crie um post para Instagram sobre [TÓPICO] que seja: 1) Envolvente e interessante, 2) Otimizado para hashtags, 3) Adequado para o público-alvo [PÚBLICO], 4) Com tom [TOM]",
  category: "Marketing",
  tags: ["instagram", "social media", "marketing"],
  is_favorite: false
})

Prompts.create_prompt(admin_user.id, %{
  title: "Brainstorm de Ideias Criativas",
  content: "Ajude-me a fazer um brainstorm de ideias criativas para [PROJETO]. Considere: 1) Público-alvo, 2) Objetivos do projeto, 3) Recursos disponíveis, 4) Tendências atuais",
  category: "Criatividade",
  tags: ["brainstorm", "ideias", "criatividade"],
  is_favorite: true
})

# Create sample prompts for regular user
Prompts.create_prompt(regular_user.id, %{
  title: "Explicação de Conceitos Complexos",
  content: "Explique o conceito de [CONCEITO] de forma simples e didática, usando: 1) Analogias do dia a dia, 2) Exemplos práticos, 3) Linguagem acessível, 4) Estrutura clara",
  category: "Educação",
  tags: ["educação", "explicação", "didática"],
  is_favorite: false
})

Prompts.create_prompt(regular_user.id, %{
  title: "Análise SWOT para Negócios",
  content: "Faça uma análise SWOT completa para [EMPRESA/PROJETO]: 1) Forças (Strengths), 2) Fraquezas (Weaknesses), 3) Oportunidades (Opportunities), 4) Ameaças (Threats)",
  category: "Negócios",
  tags: ["swot", "análise", "negócios", "estratégia"],
  is_favorite: true
})

IO.puts("Database seeded successfully!")
IO.puts("Demo users created:")
IO.puts("- Admin: admin@example.com / admin123")
IO.puts("- User: user@example.com / user123")