import { Module } from '@nestjs/common';
import { PROFIL_REPOSITORY } from 'src/modules/profil/domain/repositories/profil.repository.js';
import { PrismaProfilRepository } from 'src/modules/profil/infrastructure/repositories/prisma-profil.repository.js';

@Module({
  providers: [{ provide: PROFIL_REPOSITORY, useClass: PrismaProfilRepository }],
  exports: [PROFIL_REPOSITORY],
})
export class ProfilModule {}
