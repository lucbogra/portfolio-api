import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
