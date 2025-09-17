import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient, createSupabaseServiceClient } from '../config/supabase.config';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => createSupabaseClient(configService),
      inject: [ConfigService],
    },
    {
      provide: 'SUPABASE_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => createSupabaseServiceClient(configService),
      inject: [ConfigService],
    },
  ],
  exports: ['SUPABASE_CLIENT', 'SUPABASE_SERVICE_CLIENT'],
})
export class SupabaseModule {}