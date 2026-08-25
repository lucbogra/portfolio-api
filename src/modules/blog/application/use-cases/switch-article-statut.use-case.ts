import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { StatutArticleType } from "../../domain/value-objects/statut-article.value-object.js";
import { ArticleId } from "../../domain/value-objects/article-id.value-object.js";
import { ArticleIntrouvableError } from "../../domain/errors/article-introuvable.error.js";
import { Article } from "../../domain/entities/article.entity.js";

export interface SwitchArticleInput {
    id: string;
    statut: StatutArticleType;
}

@Injectable()
export class SwitchArticleStatutUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(input: SwitchArticleInput): Promise<Article> {
        const articleId = ArticleId.create(input.id);
        const article = await this.articleRepository.findById(articleId);
        
        if(!article) {
            throw new ArticleIntrouvableError(input.id);
        }

        article.changerStatut(input.statut);

        await this.articleRepository.save(article);
       
        return article;
    }
}