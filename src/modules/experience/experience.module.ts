import { Module } from '@nestjs/common';
import { EXPERIENCE_REPOSITORY } from 'src/modules/experience/domain/repositories/experience.repository.js';
import { PROJET_REPOSITORY } from 'src/modules/experience/domain/repositories/projet.repository.js';
import { PrismaExperienceRepository } from 'src/modules/experience/infrastructure/repositories/prisma-experience.repository.js';
import { PrismaProjetRepository } from 'src/modules/experience/infrastructure/repositories/prisma-projet.repository.js';

@Module({
  providers: [
    { provide: EXPERIENCE_REPOSITORY, useClass: PrismaExperienceRepository },
    { provide: PROJET_REPOSITORY, useClass: PrismaProjetRepository },
  ],
  exports: [EXPERIENCE_REPOSITORY, PROJET_REPOSITORY],
})
export class ExperienceModule {}
