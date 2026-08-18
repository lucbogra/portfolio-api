import { Inject, Injectable } from '@nestjs/common';
import { type ExperienceRepository, EXPERIENCE_REPOSITORY} from 'src/modules/experience/domain/repositories/experience.repository.js';
import { Experience } from 'src/modules/experience/domain/entities/experience.entity.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';
import { Contexte, ContexteType } from 'src/modules/experience/domain/value-objects/contexte.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';

export interface CreateExperienceInput {
  slug: string;
  dateDebut: Date;
  dateFin: Date | null;
  titre: string;
  entreprise: string;
  contexte: ContexteType;
  description: string;
  lienDemo: string | null;
}

@Injectable()
export class CreateExperienceUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experienceRepository: ExperienceRepository,
  ) {}

  async execute(input: CreateExperienceInput): Promise<Experience> {
    const experience = Experience.create({
        id: ExperienceId.generate(),
        slug: Slug.create(input.slug),
        titre: input.titre,
        entreprise: input.entreprise,
        periode: Periode.create(input.dateDebut, input.dateFin),
        contexte: Contexte.create(input.contexte),
        description: input.description,
        lienDemo: input.lienDemo ? Lien.create(input.lienDemo) : null
    })

    await this.experienceRepository.save(experience);
    return experience;
  }
}