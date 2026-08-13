import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Article } from 'src/modules/blog/domain/entities/article.entity.js';
import { ArticleId } from 'src/modules/blog/domain/value-objects/article-id.value-object.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';

export interface ArticleRepository {
  save(article: Article): Promise<void>;
  findById(id: ArticleId): Promise<Article | null>;
  findBySlug(slug: Slug): Promise<Article | null>;
  findByCategorie(categoryId: CategorieId): Promise<Article[]>;
  findAll(): Promise<Article[]>;
  delete(id: ArticleId): Promise<void>;
}

export const ARTICLE_REPOSITORY = Symbol('ARTICLE_REPOSITORY');
