import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { Article } from "../../domain/entities/article.entity.js";
import { CategorieId } from "../../domain/value-objects/categorie-id.value-object.js";

@Injectable()
export class GetArticlesByCategorieUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(categorieId: string): Promise<Article[]> {
        return await this.articleRepository.findByCategorie(CategorieId.create(categorieId));
    }
}