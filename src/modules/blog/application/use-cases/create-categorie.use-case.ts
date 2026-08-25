import { Inject, Injectable } from "@nestjs/common";
import { CATEGORIE_REPOSITORY, type CategorieRepository } from "../../domain/repositories/categorie.repository.js";
import { Categorie } from "../../domain/entities/categorie.entity.js";
import { CategorieId } from "../../domain/value-objects/categorie-id.value-object.js";
import { Slug } from "src/shared/domain/value-objects/slug/slug.value-object.js";

export interface CreateCategorieInput {
    slug: string;
    nom: string;
};

@Injectable()
export class CreateCategorieUseCase {
    constructor (
        @Inject(CATEGORIE_REPOSITORY)
        private readonly categorieRepository: CategorieRepository
    ) {}

    async execute(input: CreateCategorieInput): Promise<Categorie> {
        const category = Categorie.create({
            id: CategorieId.generate(),
            slug: Slug.create(input.slug),
            nom: input.nom
        });
        await this.categorieRepository.save(category);
        return category;
    }
}