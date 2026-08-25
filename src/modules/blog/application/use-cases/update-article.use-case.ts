import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_REPOSITORY, type ArticleRepository } from "../../domain/repositories/article.repository.js";
import { Article } from "../../domain/entities/article.entity.js";
import { ArticleId } from "../../domain/value-objects/article-id.value-object.js";
import { ArticleIntrouvableError } from "../../domain/errors/article-introuvable.error.js";
import { CategorieId } from "../../domain/value-objects/categorie-id.value-object.js";

export interface UpdateArticleInput {
    id: string;
    categorieId: string;
    nom: string;
    image: string | null;
    contenu: string;
}

@Injectable()
export class UpdateArticleUseCase {
    constructor(
        @Inject(ARTICLE_REPOSITORY)
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(input: UpdateArticleInput): Promise<Article> {
       
        const articleId = ArticleId.create(input.id);
        const article = await this.articleRepository.findById(articleId);

        if(!article) {
            throw new ArticleIntrouvableError(input.id);
        }

        article.update({
            categorieId : CategorieId.create(input.categorieId),
            nom: input.nom,
            image: input.image,
            contenu: input.contenu,
        })

        await this.articleRepository.save(article);

        return article;
    }
}