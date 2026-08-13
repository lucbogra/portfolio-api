import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Experience } from 'src/modules/experience/domain/entities/experience.entity.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';

export interface ExperienceRepository {
  save(experience: Experience): Promise<void>;
  findById(id: ExperienceId): Promise<Experience | null>;
  findBySlug(slug: Slug): Promise<Experience | null>;
  findAll(): Promise<Experience[]>;
  delete(id: ExperienceId): Promise<void>;
}

export const EXPERIENCE_REPOSITORY = Symbol('EXPERIENCE_REPOSITORY');
