import { Inject, Injectable } from "@nestjs/common";
import { PROJET_REPOSITORY, type ProjetRepository } from "../../domain/repositories/projet.repository.js";
import { Projet } from "../../domain/entities/projet.entity.js";
import { ProjetId } from "../../domain/value-objects/projet-id.value-object.js";
import { Lien } from "src/shared/domain/value-objects/lien/lien.value-object.js";
import { Periode } from "src/shared/domain/value-objects/periode/periode.value-object.js";
import { ExperienceId } from "../../domain/value-objects/experience-id.value-object.js";
import { Slug } from "src/shared/domain/value-objects/slug/slug.value-object.js";

export interface CreateProjetInput {
    slug: string,
    nom: string,
    experienceId: string|null,
    dateDebut: Date,
    dateFin: Date|null,
    details: string,
    resume: string|null,
    github: string|null,
    image: string|null,
    lienDemo: string|null,
    enAvant: boolean,
    ordreAffichage: number|null,
}

@Injectable()
export class CreateProjetUseCase {
    constructor(@Inject(PROJET_REPOSITORY)
    private readonly projetRepository: ProjetRepository
    ) {}

    async execute(input: CreateProjetInput): Promise<Projet> {
        const projet = Projet.create({
            id: ProjetId.generate(),
            slug: Slug.create(input.slug),
            experienceId: input.experienceId ? ExperienceId.create(input.experienceId) : null,
            nom: input.nom,
            periode: Periode.create(input.dateDebut, input.dateFin),
            details: input.details,
            resume: input.resume,
            github: input.github ? Lien.create(input.github) : null,
            image: input.image,
            lienDemo: input.lienDemo ? Lien.create(input.lienDemo) : null,
            enAvant: input.enAvant,
            ordreAffichage: input.ordreAffichage,
        });

        await this.projetRepository.save(projet);

        return projet;
    }
}