import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { Article } from "../../domain/entities/article.entity.js";

@Injectable()
export class ListArticleUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(): Promise<Article[]> {
        return await this.articleRepository.findAll();
    }
}