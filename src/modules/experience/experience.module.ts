import { Module } from '@nestjs/common';
import { EXPERIENCE_REPOSITORY } from 'src/modules/experience/domain/repositories/experience.repository.js';
import { PROJET_REPOSITORY } from 'src/modules/experience/domain/repositories/projet.repository.js';
import { PrismaExperienceRepository } from 'src/modules/experience/infrastructure/repositories/prisma-experience.repository.js';
import { PrismaProjetRepository } from 'src/modules/experience/infrastructure/repositories/prisma-projet.repository.js';
import { ExperienceController } from './presentation/controllers/experience.controller.js';
import { CreateExperienceUseCase } from './application/use-cases/create-experience.use-case.js';
import { ListExperiencesUseCase } from './application/use-cases/list-experiences.use-case.js';
import { GetExperienceBySlugUseCase } from './application/use-cases/get-experience-by-slug.use-case.js';
import { UpdateExperienceUseCase } from './application/use-cases/update-experience.use-case.js';
import { DeleteExperienceUseCase } from './application/use-cases/delete-experience.use-case.js';

@Module({
  controllers: [ExperienceController],
  providers: [
    { provide: EXPERIENCE_REPOSITORY, useClass: PrismaExperienceRepository },
    { provide: PROJET_REPOSITORY, useClass: PrismaProjetRepository },
    CreateExperienceUseCase,
    ListExperiencesUseCase,
    GetExperienceBySlugUseCase,
    UpdateExperienceUseCase,
    DeleteExperienceUseCase,
  ],
  exports: [EXPERIENCE_REPOSITORY, PROJET_REPOSITORY],
})
export class ExperienceModule {}
