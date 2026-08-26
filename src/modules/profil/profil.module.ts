import { Module } from '@nestjs/common';
import { PROFIL_REPOSITORY } from 'src/modules/profil/domain/repositories/profil.repository.js';
import { PrismaProfilRepository } from 'src/modules/profil/infrastructure/repositories/prisma-profil.repository.js';
import { GetProfilUseCase } from './application/use-cases/get-profil.use-case.js';
import { UpdateProfilUseCase } from './application/use-cases/update-profil.use-case.js';
import { ProfilController } from './presentation/controllers/profil.controller.js';

@Module({
  controllers: [ProfilController],
  providers: [{ provide: PROFIL_REPOSITORY, useClass: PrismaProfilRepository },
    GetProfilUseCase,
    UpdateProfilUseCase,
  ],
  
  exports: [PROFIL_REPOSITORY],
})
export class ProfilModule {}
