import { Inject, Injectable } from "@nestjs/common";
import { EXPERIENCE_REPOSITORY, type ExperienceRepository } from "../../domain/repositories/experience.repository.js";
import { ExperienceId } from "../../domain/value-objects/experience-id.value-object.js";
import { ExperienceIntrouvableError } from "../../domain/errors/experience-introuvable.error.js";

@Injectable()
export class DeleteExperienceUseCase {
    constructor(
        @Inject(EXPERIENCE_REPOSITORY)
        private readonly experienceRepository: ExperienceRepository
    ) {}

    async execute(id: string): Promise<void> {
        const experienceId = ExperienceId.create(id);
        const experience = await this.experienceRepository.findById(experienceId);

        if(!experience) {
            throw new ExperienceIntrouvableError(id);
        }

        await this.experienceRepository.delete(experienceId);
    }
}