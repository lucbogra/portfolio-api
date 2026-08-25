import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { Article } from "../../domain/entities/article.entity.js";
import { Slug } from "src/shared/domain/value-objects/slug/slug.value-object.js";
import { ArticleIntrouvableError } from "../../domain/errors/article-introuvable.error.js";

@Injectable()
export class GetArticleBySlugUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(slug: string): Promise<Article> {
       
        const article = await this.articleRepository.findBySlug(Slug.create(slug));

        if(!article) {
            throw new ArticleIntrouvableError(slug);
        }
        
        return article;
    }
}