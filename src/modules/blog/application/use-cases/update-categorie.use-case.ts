import { Inject, Injectable } from "@nestjs/common";
import { CATEGORIE_REPOSITORY, type CategorieRepository } from "../../domain/repositories/categorie.repository.js";
import { Categorie } from "../../domain/entities/categorie.entity.js";
import { CategorieId } from "../../domain/value-objects/categorie-id.value-object.js";
import { CategorieIntrouvableError } from "../../domain/errors/categorie-introuvable.error.js";

export interface UpdateCategorieInput {
    id: string,
    nom: string
};

@Injectable()
export class UpdateCategorieUseCase {
    constructor(
        @Inject(CATEGORIE_REPOSITORY)
        private readonly categoryRepository: CategorieRepository
    ) {}

    async execute(input: UpdateCategorieInput): Promise<Categorie> {
        const categorie = await this.categoryRepository.findById(CategorieId.create(input.id));
        
        if(!categorie) {
            throw new CategorieIntrouvableError(input.id);
        }

        categorie.update({
            nom: input.nom
        });

        await this.categoryRepository.save(categorie);

        return categorie;
        
    }
}