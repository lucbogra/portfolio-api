import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { Article } from "../../domain/entities/article.entity.js";
import { ArticleId } from "../../domain/value-objects/article-id.value-object.js";
import { Slug } from "src/shared/domain/value-objects/slug/slug.value-object.js";
import { CategorieId } from "../../domain/value-objects/categorie-id.value-object.js";

export interface CreateArticleInput {
    slug: string;
    categorieId: string;
    nom: string;
    image: string | null;
    contenu: string;
}

@Injectable()
export class CreateArticleUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(input: CreateArticleInput): Promise<Article> {
        const article = Article.create({
            id: ArticleId.generate(),
            slug: Slug.create(input.slug),
            categorieId: CategorieId.create(input.categorieId),
            nom: input.nom,
            image: input.image,
            contenu: input.contenu,
        });

        await this.articleRepository.save(article);

        return article;
    }
}