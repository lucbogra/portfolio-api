import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Projet } from 'src/modules/experience/domain/entities/projet.entity.js';
import { ProjetId } from 'src/modules/experience/domain/value-objects/projet-id.value-object.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';

export interface ProjetRepository {
  save(projet: Projet): Promise<void>;
  findById(id: ProjetId): Promise<Projet | null>;
  findBySlug(slug: Slug): Promise<Projet | null>;
  findByExperienceId(experienceId: ExperienceId): Promise<Projet[]>;
  findAll(): Promise<Projet[]>;
  delete(id: ProjetId): Promise<void>;
}

export const PROJET_REPOSITORY = Symbol('PROJET_REPOSITORY');
