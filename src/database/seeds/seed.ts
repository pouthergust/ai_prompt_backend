import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Prompt, PromptCategory } from '../../prompts/entities/prompt.entity';
import * as bcrypt from 'bcrypt';

export async function runSeeds(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const promptRepository = dataSource.getRepository(Prompt);

  // Create demo users
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  const adminUser = userRepository.create({
    name: 'Administrador',
    email: 'admin@example.com',
    password: hashedAdminPassword,
  });

  const regularUser = userRepository.create({
    name: 'Usuário',
    email: 'user@example.com',
    password: hashedUserPassword,
  });

  const savedAdminUser = await userRepository.save(adminUser);
  const savedRegularUser = await userRepository.save(regularUser);

  // Create sample prompts for admin user
  const adminPrompts = [
    {
      title: 'Análise de Código Python',
      content: 'Analise o seguinte código Python e forneça feedback sobre: 1) Qualidade do código, 2) Possíveis melhorias, 3) Bugs potenciais, 4) Padrões de design:\n\n[CÓDIGO]',
      category: PromptCategory.DESENVOLVIMENTO,
      tags: ['python', 'análise', 'código'],
      isFavorite: true,
      userId: savedAdminUser.id,
    },
    {
      title: 'Criação de Post para Instagram',
      content: 'Crie um post para Instagram sobre [TÓPICO] que seja: 1) Envolvente e interessante, 2) Otimizado para hashtags, 3) Adequado para o público-alvo [PÚBLICO], 4) Com tom [TOM]',
      category: PromptCategory.MARKETING,
      tags: ['instagram', 'social media', 'marketing'],
      isFavorite: false,
      userId: savedAdminUser.id,
    },
    {
      title: 'Brainstorm de Ideias Criativas',
      content: 'Ajude-me a fazer um brainstorm de ideias criativas para [PROJETO]. Considere: 1) Público-alvo, 2) Objetivos do projeto, 3) Recursos disponíveis, 4) Tendências atuais',
      category: PromptCategory.CRIATIVIDADE,
      tags: ['brainstorm', 'ideias', 'criatividade'],
      isFavorite: true,
      userId: savedAdminUser.id,
    },
  ];

  // Create sample prompts for regular user
  const userPrompts = [
    {
      title: 'Explicação de Conceitos Complexos',
      content: 'Explique o conceito de [CONCEITO] de forma simples e didática, usando: 1) Analogias do dia a dia, 2) Exemplos práticos, 3) Linguagem acessível, 4) Estrutura clara',
      category: PromptCategory.EDUCACAO,
      tags: ['educação', 'explicação', 'didática'],
      isFavorite: false,
      userId: savedRegularUser.id,
    },
    {
      title: 'Análise SWOT para Negócios',
      content: 'Faça uma análise SWOT completa para [EMPRESA/PROJETO]: 1) Forças (Strengths), 2) Fraquezas (Weaknesses), 3) Oportunidades (Opportunities), 4) Ameaças (Threats)',
      category: PromptCategory.NEGOCIOS,
      tags: ['swot', 'análise', 'negócios', 'estratégia'],
      isFavorite: true,
      userId: savedRegularUser.id,
    },
  ];

  // Save prompts
  for (const promptData of [...adminPrompts, ...userPrompts]) {
    const prompt = promptRepository.create(promptData);
    await promptRepository.save(prompt);
  }

  console.log('Database seeded successfully!');
  console.log('Demo users created:');
  console.log('- Admin: admin@example.com / admin123');
  console.log('- User: user@example.com / user123');
}