import { Inject, Injectable } from "@nestjs/common";
import { CATEGORIE_REPOSITORY, type CategorieRepository } from "../../domain/repositories/categorie.repository.js";
import { CategorieId } from "../../domain/value-objects/categorie-id.value-object.js";
import { CategorieIntrouvableError } from "../../domain/errors/categorie-introuvable.error.js";

@Injectable()
export class DeleteCategorieUseCase {
    constructor(
        @Inject(CATEGORIE_REPOSITORY)
        private readonly categorieRepository: CategorieRepository
    ) {}

    async execute(id: string): Promise<void> {
        const categorieId = CategorieId.create(id);
        const categorie = await this.categorieRepository.findById(categorieId);

        if(!categorie) {
            throw new CategorieIntrouvableError(id);
        }
        
        await this.categorieRepository.delete(categorieId);
    }
}