import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object.js";
import { Projet } from "../entities/projet.entity.js";
import { ProjetId } from "../value-objects/projet-id.value-object.js";
import { ExperienceId } from "../value-objects/experience-id.value-object.js";

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