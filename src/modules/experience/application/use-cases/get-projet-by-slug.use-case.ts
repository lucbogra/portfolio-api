import { Inject, Injectable } from "@nestjs/common";
import { PROJET_REPOSITORY, type ProjetRepository } from "../../domain/repositories/projet.repository.js";
import { Projet } from "../../domain/entities/projet.entity.js";
import { Slug } from "src/shared/domain/value-objects/slug/slug.value-object.js";
import { ProjetIntrouvableError } from "../../domain/errors/projet-introuvable.error.js";

@Injectable()
export class GetProjetBySlugUseCase {
    constructor(
        @Inject(PROJET_REPOSITORY)
        private readonly projetRepository: ProjetRepository
    ) {}

    async execute(slug: string): Promise<Projet> {
        const projet = await this.projetRepository.findBySlug(Slug.create(slug));

        if(!projet) {
            throw new ProjetIntrouvableError(slug);
        }

        return projet;
    }
}