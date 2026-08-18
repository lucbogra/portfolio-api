import { Inject, Injectable } from '@nestjs/common';
import { type ExperienceRepository,EXPERIENCE_REPOSITORY,} from 'src/modules/experience/domain/repositories/experience.repository.js';
import { Experience } from 'src/modules/experience/domain/entities/experience.entity.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { ExperienceIntrouvableError } from 'src/modules/experience/domain/errors/experience-introuvable.error.js';

@Injectable()
export class GetExperienceBySlugUseCase {
  constructor(
    @Inject(EXPERIENCE_REPOSITORY)
    private readonly experienceRepository: ExperienceRepository,
  ) {}

  async execute(slug: string): Promise<Experience> {
    const experience = await this.experienceRepository.findBySlug(Slug.create(slug));

    if (!experience) {
      throw new ExperienceIntrouvableError(slug);
    }

    return experience;
  }
}