import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_READ_REPOSITORY, type ArticleReadRepository, type ArticlePublieListItem } from "../../domain/repositories/article-read.repository.js";

@Injectable()
export class ListArticlesPubliesUseCase {
    constructor(
        @Inject(ARTICLE_READ_REPOSITORY)
        private readonly articleReadRepository: ArticleReadRepository
    ) {}

    async execute(): Promise<ArticlePublieListItem[]> {
       return this.articleReadRepository.listPubliesWithTags();
    }
}
