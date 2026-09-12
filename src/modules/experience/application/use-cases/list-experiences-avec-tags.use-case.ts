import { Inject, Injectable } from "@nestjs/common";
import { EXPERIENCE_READ_REPOSITORY, type ExperienceReadRepository, type ExperienceListItem } from "../../domain/repositories/experience-read.repository.js";

@Injectable()
export class ListExperiencesAvecTagsUseCase {
    constructor(
        @Inject(EXPERIENCE_READ_REPOSITORY)
        private readonly experienceReadRepository: ExperienceReadRepository
    ) {}

    async execute(): Promise<ExperienceListItem[]> {
       return this.experienceReadRepository.listAllWithTags();
    }
}
