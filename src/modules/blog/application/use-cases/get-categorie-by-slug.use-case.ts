import { Inject, Injectable } from "@nestjs/common";
import { CATEGORIE_REPOSITORY, type CategorieRepository } from "../../domain/repositories/categorie.repository.js";
import { Categorie } from "../../domain/entities/categorie.entity.js";
import { Slug } from "src/shared/domain/value-objects/slug/slug.value-object.js";
import { CategorieIntrouvableError } from "../../domain/errors/categorie-introuvable.error.js";

@Injectable()
export class GetCategorieBySlugUseCase {
    constructor(
        @Inject(CATEGORIE_REPOSITORY)
        private readonly categorieRepository: CategorieRepository
    ) {}

    async execute(slug: string): Promise<Categorie> {
        const categorie = await this.categorieRepository.findBySlug(Slug.create(slug));

        if(!categorie) {
            throw new CategorieIntrouvableError(slug);
        }

        return categorie;
    }
}