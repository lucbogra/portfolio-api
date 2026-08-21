import { Inject, Injectable } from "@nestjs/common";
import { PROJET_REPOSITORY, type ProjetRepository } from "../../domain/repositories/projet.repository.js";
import { Projet } from "../../domain/entities/projet.entity.js";
import { ProjetId } from "../../domain/value-objects/projet-id.value-object.js";
import { ProjetIntrouvableError } from "../../domain/errors/projet-introuvable.error.js";
import { ExperienceId } from "../../domain/value-objects/experience-id.value-object.js";
import { Periode } from "src/shared/domain/value-objects/periode/periode.value-object.js";
import { Lien } from "src/shared/domain/value-objects/lien/lien.value-object.js";

export interface updateProjetInput {
    id: string,
    nom: string,
    experienceId: string|null,
    dateDebut: Date,
    dateFin: Date|null,
    details: string,
    github: string|null,
    image: string|null,
    lienDemo: string|null,
}

@Injectable()
export class UpdateProjetUseCase {
    constructor(
        @Inject(PROJET_REPOSITORY)
        private readonly projetRepository: ProjetRepository
    ) {}

    async execute(input: updateProjetInput): Promise<Projet> {
        const projet = await this.projetRepository.findById(ProjetId.create(input.id));

        if(!projet) {
            throw new ProjetIntrouvableError(input.id);
        }

        projet.update({
            nom: input.nom,
            experienceId: input.experienceId ? ExperienceId.create(input.experienceId) : null,
            periode: Periode.create(input.dateDebut, input.dateFin),
            details: input.details,
            github: input.github ? Lien.create(input.github) : null,
            image: input.image,
            lienDemo: input.lienDemo ? Lien.create(input.lienDemo) : null
        });

        await this.projetRepository.save(projet);

        return projet;
    }
}