import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_READ_REPOSITORY, type ArticleReadRepository, type ArticlePublieListItem } from "../../domain/repositories/article-read.repository.js";
import { ArticleIntrouvableError } from "../../domain/errors/article-introuvable.error.js";

@Injectable()
export class GetArticlePublieBySlugUseCase {
    constructor(
        @Inject(ARTICLE_READ_REPOSITORY)
        private readonly articleReadRepository: ArticleReadRepository
    ) {}

    async execute(slug: string): Promise<ArticlePublieListItem> {
        const article = await this.articleReadRepository.findPublieBySlug(slug);

        if (!article) {
            throw new ArticleIntrouvableError(slug);
        }

        return article;
    }
}
