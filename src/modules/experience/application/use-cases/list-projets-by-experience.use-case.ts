import { Inject, Injectable } from "@nestjs/common";
import { PROJET_REPOSITORY, type ProjetRepository } from "../../domain/repositories/projet.repository.js";
import { Projet } from "../../domain/entities/projet.entity.js";
import { ExperienceId } from "../../domain/value-objects/experience-id.value-object.js";

@Injectable()
export class ListProjetsByExperienceUseCase {
    constructor(
        @Inject(PROJET_REPOSITORY)
        private readonly projetRepository: ProjetRepository
    ) {}

    async execute(experienceId: string): Promise<Projet[]> {
        return this.projetRepository.findByExperienceId(ExperienceId.create(experienceId));
    }
}