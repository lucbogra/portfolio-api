import { Inject, Injectable } from "@nestjs/common";
import { PROJET_READ_REPOSITORY, type ProjetReadRepository, type ProjetListItem } from "../../domain/repositories/projet-read.repository.js";

@Injectable()
export class ListProjetsAvecExperienceUseCase {
    constructor(
        @Inject(PROJET_READ_REPOSITORY)
        private readonly projetReadRepository: ProjetReadRepository
    ) {}

    async execute(): Promise<ProjetListItem[]> {
       return this.projetReadRepository.listAllWithExperienceAndTags();
    }
}
