import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { ClerkClient, verifyToken } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  constructor(
    @Inject('ClerkClient') private clerkClient: ClerkClient,
    private configService: ConfigService,
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    try {
      // Extrair o token do cabeçalho de autorização
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token de autenticação não fornecido');
      }

      const token = authHeader.split(' ')[1];

      // Verificar o token usando o SDK do Clerk
      const jwtKey = this.configService.get<string>('CLERK_JWT_KEY');
      const verifiedToken = await verifyToken(token, {
        jwtKey,
        authorizedParties: [
          'http://localhost:5173',
          'http://localhost:3000',
          // Adicione outros domínios autorizados conforme necessário
        ],
      });

      // Obter informações do usuário do Clerk
      const userId = verifiedToken.sub;
      const user = await this.clerkClient.users.getUser(userId);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Retornar as informações do usuário que serão anexadas ao objeto de requisição
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        // Adicione outros campos conforme necessário
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}