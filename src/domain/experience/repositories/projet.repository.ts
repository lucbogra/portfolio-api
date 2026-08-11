import { Projet } from '../entities/projet.entity';
import { ProjetId } from '../value-objects/projet-id.value-object';
import { ExperienceId } from '../value-objects/experience-id.value-object';
import { Slug } from '../../shared/value-objects/slug/slug.value-object';

export interface ProjetRepository {
  save(projet: Projet): Promise<void>;
  findById(id: ProjetId): Promise<Projet | null>;
  findBySlug(slug: Slug): Promise<Projet | null>;
  findByExperienceId(experienceId: ExperienceId): Promise<Projet[]>;
  findAutonomes(): Promise<Projet[]>;   // projets sans experienceId
  findAll(): Promise<Projet[]>;
  delete(id: ProjetId): Promise<void>;
}

export const PROJET_REPOSITORY = Symbol('PROJET_REPOSITORY');