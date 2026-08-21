import { Inject, Injectable } from "@nestjs/common";
import { PROJET_REPOSITORY, type ProjetRepository } from "../../domain/repositories/projet.repository.js";
import { ProjetId } from "../../domain/value-objects/projet-id.value-object.js";
import { ProjetIntrouvableError } from "../../domain/errors/projet-introuvable.error.js";

@Injectable()
export class DeleteProjetUseCase {
    constructor(
        @Inject(PROJET_REPOSITORY)
        private readonly projetRepository: ProjetRepository
    ) {}

    async execute(id: string): Promise<void> {
        const projet = await this.projetRepository.findById(ProjetId.create(id));

        if(!projet) {
            throw new ProjetIntrouvableError(id);
        }

        await this.projetRepository.delete(projet.id);
    }
}