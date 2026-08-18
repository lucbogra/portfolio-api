import { Inject, Injectable } from '@nestjs/common';
import { type ExperienceRepository,EXPERIENCE_REPOSITORY} from 'src/modules/experience/domain/repositories/experience.repository.js';
import { Experience } from 'src/modules/experience/domain/entities/experience.entity.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';
import { Contexte, ContexteType } from 'src/modules/experience/domain/value-objects/contexte.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { ExperienceIntrouvableError } from 'src/modules/experience/domain/errors/experience-introuvable.error.js';

export interface UpdateExperienceInput {
  id: string;
  titre: string;
  entreprise: string;
  contexte: ContexteType;
  description: string;
  dateDebut: Date;
  dateFin: Date | null;
  lienDemo: string | null;
}

@Injectable()
export class UpdateExperienceUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experienceRepository: ExperienceRepository,
  ) {}

  async execute(input: UpdateExperienceInput): Promise<Experience> {
    const experienceId = ExperienceId.create(input.id);
    const experience = await this.experienceRepository.findById(experienceId);

    if (!experience) {
      throw new ExperienceIntrouvableError(input.id);
    }

    experience.update({
      titre: input.titre,
      entreprise: input.entreprise,
      contexte: Contexte.create(input.contexte),
      description: input.description,
      periode: Periode.create(input.dateDebut, input.dateFin),
      lienDemo: input.lienDemo ? Lien.create(input.lienDemo) : null,
    });

    await this.experienceRepository.save(experience);

    return experience;
  }
}