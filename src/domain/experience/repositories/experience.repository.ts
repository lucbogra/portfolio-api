import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object";
import { Experience } from "../entities/experience.entity";
import { ExperienceId } from "../value-objects/experience-id.value-object";

export interface ExperienceRepository {
    save(experience: Experience): Promise<void>;
    findById(id: ExperienceId): Promise<Experience | null>;
    findBySlug(slug: Slug): Promise<Experience | null>;
    findAll(): Promise<Experience[]>;
    delete(id: ExperienceId): Promise<void>;
}

export const EXPERIENCE_REPOSITORY = Symbol('EXPERIENCE_REPOSITORY');