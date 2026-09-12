import { Module } from '@nestjs/common';
import { EXPERIENCE_REPOSITORY } from 'src/modules/experience/domain/repositories/experience.repository.js';
import { PROJET_REPOSITORY } from 'src/modules/experience/domain/repositories/projet.repository.js';
import { PROJET_READ_REPOSITORY } from 'src/modules/experience/domain/repositories/projet-read.repository.js';
import { EXPERIENCE_READ_REPOSITORY } from 'src/modules/experience/domain/repositories/experience-read.repository.js';
import { PrismaExperienceRepository } from 'src/modules/experience/infrastructure/repositories/prisma-experience.repository.js';
import { PrismaProjetRepository } from 'src/modules/experience/infrastructure/repositories/prisma-projet.repository.js';
import { PrismaProjetReadRepository } from 'src/modules/experience/infrastructure/repositories/prisma-projet-read.repository.js';
import { PrismaExperienceReadRepository } from 'src/modules/experience/infrastructure/repositories/prisma-experience-read.repository.js';
import { ExperienceController } from './presentation/controllers/experience.controller.js';
import { CreateExperienceUseCase } from './application/use-cases/create-experience.use-case.js';
import { ListExperiencesAvecTagsUseCase } from './application/use-cases/list-experiences-avec-tags.use-case.js';
import { GetExperienceBySlugUseCase } from './application/use-cases/get-experience-by-slug.use-case.js';
import { UpdateExperienceUseCase } from './application/use-cases/update-experience.use-case.js';
import { DeleteExperienceUseCase } from './application/use-cases/delete-experience.use-case.js';
import { ProjetController } from './presentation/controllers/projet.controller.js';
import { CreateProjetUseCase } from './application/use-cases/create-projet.use-case.js';
import { ListProjetsUseCase } from './application/use-cases/list-projets.use-case.js';
import { GetProjetBySlugUseCase } from './application/use-cases/get-projet-by-slug.use-case.js';
import { UpdateProjetUseCase } from './application/use-cases/update-projet.use-case.js';
import { DeleteProjetUseCase } from './application/use-cases/delete-projet.use-case.js';
import { ListProjetsAutonomesUseCase } from './application/use-cases/list-projets-autonomes.use-case.js';
import { ListProjetsByExperienceUseCase } from './application/use-cases/list-projets-by-experience.use-case.js';
import { ListProjetsAvecExperienceUseCase } from './application/use-cases/list-projets-avec-experience.use-case.js';
import { ListProjetsSelectionUseCase } from './application/use-cases/list-projets-selection.use-case.js';
import { TagModule } from '../tag/tag.module.js';

@Module({
  imports: [TagModule],
  controllers: [ExperienceController, ProjetController],
  providers: [
    { provide: EXPERIENCE_REPOSITORY, useClass: PrismaExperienceRepository },
    { provide: PROJET_REPOSITORY, useClass: PrismaProjetRepository },
    { provide: PROJET_READ_REPOSITORY, useClass: PrismaProjetReadRepository },
    { provide: EXPERIENCE_READ_REPOSITORY, useClass: PrismaExperienceReadRepository },
    CreateExperienceUseCase,
    ListExperiencesAvecTagsUseCase,
    GetExperienceBySlugUseCase,
    UpdateExperienceUseCase,
    DeleteExperienceUseCase,
    CreateProjetUseCase,
    ListProjetsUseCase,
    GetProjetBySlugUseCase,
    UpdateProjetUseCase,
    DeleteProjetUseCase,
    ListProjetsAutonomesUseCase,
    ListProjetsByExperienceUseCase,
    ListProjetsAvecExperienceUseCase,
    ListProjetsSelectionUseCase,
  ],
  exports: [EXPERIENCE_REPOSITORY, PROJET_REPOSITORY],
})
export class ExperienceModule {}
