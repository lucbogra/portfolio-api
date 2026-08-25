import { Inject, Injectable } from "@nestjs/common";
import { CATEGORIE_REPOSITORY, type CategorieRepository } from "../../domain/repositories/categorie.repository.js";
import { Categorie } from "../../domain/entities/categorie.entity.js";

@Injectable()
export class ListCategorieUseCase {
    constructor(
        @Inject(CATEGORIE_REPOSITORY)
        private readonly categorieRepository: CategorieRepository
    ) {}

    async execute(): Promise<Categorie[]> {
        return this.categorieRepository.findAll();
    }
}