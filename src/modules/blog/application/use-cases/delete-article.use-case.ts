import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { ArticleId } from "../../domain/value-objects/article-id.value-object.js";
import { ArticleIntrouvableError } from "../../domain/errors/article-introuvable.error.js";

@Injectable()
export class DeleteArticleUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(id: string): Promise<void> {
        const articleId = ArticleId.create(id);
        const article = await this.articleRepository.findById(articleId);
        if(!article) {
            throw new ArticleIntrouvableError(id);
        }
        await this.articleRepository.delete(articleId);
    }
}