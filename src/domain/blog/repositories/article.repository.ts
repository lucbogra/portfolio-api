import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object.js";
import { Article } from "../entities/article.entity.js";
import { ArticleId } from "../value-objects/article-id.value-object.js";
import { CategorieId } from "../value-objects/categorie-id.value-object.js";

export interface ArticleRepository {
    save(article: Article): Promise<void>;
    findById(id: ArticleId): Promise<Article | null>;
    findBySlug(slug: Slug): Promise<Article | null>;
    findByCategorie(categoryId: CategorieId): Promise<Article[]>;
    findAll(): Promise<Article[]>;
    delete(id: ArticleId): Promise<void>;
}

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');