import { Inject, Injectable } from "@nestjs/common";
import { EXPERIENCE_REPOSITORY, type ExperienceRepository } from "../../domain/repositories/experience.repository.js";
import { Experience } from "../../domain/entities/experience.entity.js";

@Injectable()
export class ListExperiencesUseCase {
    constructor(
        @Inject(EXPERIENCE_REPOSITORY)
        private readonly experienceReporitory: ExperienceRepository
    ) {}

    async execute(): Promise<Experience[]> {
        return this.experienceReporitory.findAll();
    }
}